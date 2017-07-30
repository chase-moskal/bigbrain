
import * as uuid from "uuid/v4"
import * as deepFreeze from "deep-freeze"
import {observable, autorun, reaction, action, computed} from "mobx"

function copy<T>(o: T): T { return JSON.parse(JSON.stringify(o)) }

export interface Context {
  readonly host: boolean
}

export interface StateEntry { readonly type: string }
export type StateEntries = Map<string, StateEntry>
export interface State { entries: StateEntries }
export interface Message { readonly to: string }
export interface Update {
  messages: Message[]
  allEntries?: { [id: string]: StateEntry }
  someEntries?: { [id: string]: StateEntry }
}

export interface EntityOptions {
  id: string
  context: Context
  state: State
}

export abstract class Entity {
  readonly id: string
  protected readonly context: Context
  private readonly state: State
  get entry() { return deepFreeze(copy(this.state.entries.get(this.id))) }

  @observable inbox: Message[] = []

  constructor({id, context, state}: EntityOptions) {
    this.id = id
    this.context = context
    this.state = state
  }

  abstract terminate(): void
}

export class GenericEntity extends Entity {
  terminate() {}
}

export type EntityClasses = {[name: string]: typeof GenericEntity}

function assignPropsOntoMap(obj: Object, map: Map<string, any>) {
  Object.keys(obj).forEach(key => map.set(key, obj[key]))
}

export abstract class Network {
  constructor(
    protected readonly state: State,
    protected readonly context: Context,
    protected readonly handleMessages: (messages: Message[]) => void
  ) {}

  @action
  applyUpdate(update: Update) {
    if (update.allEntries) {
      this.state.entries.clear()
    }
    if (update.allEntries || update.someEntries) {
      assignPropsOntoMap(copy(update.allEntries), this.state.entries)
    }
    this.handleMessages(update.messages)
  }

  abstract send(update: Update): void
}

export class LoopbackNetwork extends Network {
  send(update: Update): void {
    this.applyUpdate(update)
  }
}

export class Simulator {
  private entities: Map<string, GenericEntity> = new Map()

  constructor(
    protected readonly context: Context,
    protected readonly entityClasses: EntityClasses,
    protected readonly state: State
  ) {
    autorun(() => this.createAndDestroyEntitiesToMatch(this.getEntryReports()))
  }

  handleMessages(messages: Message[]): void {
    for (const message of messages) {
      const entity = this.entities.get(message.to)
      if (entity) entity.inbox.unshift(message)
      else console.warn(`Message undeliverable: to entity id "${message.to}"`, message)
    }
  }

  private getEntryReports() {
    return Array.from(this.state.entries.keys())
      .map(id => ({id, entry: this.state.entries.get(id)}))
  }

  private getEntityClass(type: string): typeof GenericEntity {
    const Class = <typeof GenericEntity><any>this.entityClasses[type]
    if (!Class) throw new Error(`unknown entity class "${type}"`)
    return Class
  }

  private createAndDestroyEntitiesToMatch(reports: {id: string, entry: StateEntry}[]) {

    // add new entities
    reports.forEach(({id, entry}) => {
      if (!this.entities.has(id)) {
        const entry = this.state.entries.get(id)
        const Entity = this.getEntityClass(entry.type)
        this.entities.set(id, new Entity({id, context: this.context, state: this.state}))
      }
    })

    // remove old entities
    for (const id of this.entities.keys()) {
      if (!this.state.entries.has(id)) {
        const entity = this.entities.get(id)
        entity.terminate()
        this.entities.delete(id)
      }
    }
  }

  terminate() {
    this.entities.forEach((entity) => entity.terminate())
  }
}

export default class Monarch {
  @observable readonly state: State = {entries: new Map}
  private readonly simulator: Simulator
  private readonly network: Network

  constructor(
    public readonly context: Context,
    public readonly entityClasses: EntityClasses
  ) {
    this.simulator = new Simulator(context, entityClasses, this.state)
    this.network = new LoopbackNetwork(this.state, context, messages => this.simulator.handleMessages(messages))
  }

  private generateFreshIdentifier() {
    return uuid()
  }

  addEntry<T extends StateEntry = StateEntry>(entry: T) {
    this.state.entries.set(this.generateFreshIdentifier(), entry)
  }

  removeEntry(id: string) {
    this.state.entries.delete(id)
  }
}
