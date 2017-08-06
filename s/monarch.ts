
import * as uuid from "uuid/v4"
import * as deepFreeze from "deep-freeze"
import {observable, autorun, action} from "mobx"

function copy<T>(o: T): T { return JSON.parse(JSON.stringify(o)) }

export interface StandardContext {
  readonly host: boolean
  readonly manager: Manager
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

export interface EntityOptions<gContext extends StandardContext = StandardContext> {
  id: string
  context: gContext
  state: State
}

export abstract class Entity<gContext extends StandardContext = StandardContext, gStateEntry extends StateEntry = StateEntry> {
  protected readonly context: gContext
  private readonly state: State

  readonly id: string
  get entry(): gStateEntry { return deepFreeze(copy(this.state.entries.get(this.id))) }
  @observable inbox: Message[] = []

  constructor({id, context, state}: EntityOptions<gContext>) {
    this.id = id
    this.context = context
    this.state = state
  }

  abstract destructor(): void
}

export class GenericEntity extends Entity {
  destructor() {}
}

export type EntityClasses = {[name: string]: typeof GenericEntity}

function assignPropsOntoMap(obj: Object, map: Map<string, any>) {
  Object.keys(obj).forEach(key => map.set(key, obj[key]))
}

export abstract class Network {
  constructor(
    protected readonly state: State,
    protected readonly context: StandardContext,
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

export const getEntityClass = (type: string, entityClasses: EntityClasses): typeof GenericEntity => {
  const Class = <typeof GenericEntity><any>entityClasses[type]
  if (!Class) throw new Error(`Unknown entity class "${type}"`)
  return Class
}

export function replicate(state: State, entities: Map<string, Entity>, context: StandardContext, entityClasses: EntityClasses) {

  // add new entities
  for (const [id, entry] of Array.from(state.entries)) {
    if (!entities.has(id)) {
      const entry = state.entries.get(id)
      const Entity = getEntityClass(entry.type, entityClasses)
      entities.set(id, new Entity({id, context, state}))
    }
  }

  // remove old entities
  for (const id of entities.keys()) {
    if (!state.entries.has(id)) {
      const entity = entities.get(id)
      entity.destructor()
      entities.delete(id)
    }
  }
}

export class Manager {
  constructor(private readonly state: State, private readonly entities: Map<string, Entity>) {}

  getEntities(): Entity[] {
    return Array.from(this.entities).map(([id, entity]) => entity)
  }

  addEntry<T extends StateEntry = StateEntry>(entry: T): string {
    const id: string = uuid()
    this.state.entries.set(id, entry)
    return id
  }

  removeEntry(id: string): void {
    this.state.entries.delete(id)
  }
}

export interface MonarchOptions<MoreContext = any> {
  window: Window
  canvas: HTMLCanvasElement
  entityClasses: EntityClasses
  context?: MoreContext
}

export default class Monarch<MoreContext = any> {
  readonly manager: Manager

  constructor({window, canvas, entityClasses, context: moreContext = {}}: MonarchOptions<MoreContext>) {
    const state: State = observable({entries: new Map})
    const entities: Map<string, Entity> = new Map()
    const manager = new Manager(state, entities)

    const context = <StandardContext & MoreContext>{
      host: true,
      manager,
      ...moreContext
    }

    autorun(() => replicate(state, entities, context, entityClasses))

    const network = new LoopbackNetwork(state, context, messages => {
      for (const message of messages) {
        const entity = entities.get(message.to)
        if (entity) entity.inbox.unshift(message)
        else console.warn(`Message undeliverable: to entity id "${message.to}"`, message)
      }
    })

    this.manager = manager
  }
}
