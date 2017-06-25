
/*

Experimental concept grounds for game engine ideas

  const state = {entities:{}}
  const context = new EngineContext({host: true})
  const network = new Network({context})
  const simulator = new Simulator({context, entityClasses: {Cube, Horse, Landscape, Spectator}})

  const monarch = new Monarch({state, context, network, simulator})

*/

import Ticker, {Tick} from "./Ticker"

export interface MonarchOptions {
  state: State
  context: EngineContext
  network: Network
  simulator: Simulator
}

export default class Monarch {
  private readonly state: State
  private readonly context: EngineContext
  private readonly network: Network
  private readonly simulator: Simulator
  private readonly ticker: Ticker

  constructor(options: MonarchOptions) {
    this.state = options.state
    this.context = options.context
    this.network = options.network
    this.simulator = options.simulator
    this.ticker = new Ticker({action: tick => this.mainloop(tick)})
  }

  start() {
    this.ticker.start()
  }

  stop() {
    this.ticker.stop()
  }

  private mainloop(tick: Tick) {
    const input = this.network.recv(this.state)
    const output = this.simulator.simulate({tick, ...input})
    this.network.send(output)
  }
}

export interface EngineContextOptions {
  host: boolean
}

export class EngineContext {
  readonly host: boolean

  constructor(options: EngineContextOptions) {
    this.host = options.host
  }
}

////
//// ENTITY MESSAGES: REQUESTS AND RESPONSES
////

export interface Message {
  recipient: string
}
export interface Request extends Message {}
export interface Response extends Message {}

////
//// STATE AND ENTRIES
////

export interface StateEntry {
  type: string
}

export interface State {
  [id: string]: StateEntry
}

////
//// ENTITIES
////

export interface EntityOptions {
  id: string
  context: EngineContext
}

export interface EntitySimulationInput {
  tick: Tick
  entry: StateEntry
  messages: Message[]
}

export interface EntitySimulationOutput {
  entry: StateEntry
  messages: Message[]
}

export abstract class Entity {
  readonly id: string
  protected readonly context: EngineContext

  constructor(options: EntityOptions) {
    this.id = options.id
    this.context = options.context
  }

  abstract simulate(input: EntitySimulationInput): EntitySimulationOutput
  abstract destructor()
}

export class GenericEntity extends Entity {
  simulate(input: EntitySimulationInput): EntitySimulationOutput { throw new Error(`generic implementation not for use`) }
  destructor() { throw new Error(`generic implementation not for use`) }
}

export interface SimulationInput {
  tick: Tick
  state: State
  messages: Message[]
}

export interface SimulationOutput {
  state: State
  messages: Message[]
}

export interface SimulatorOptions {
  context: EngineContext
  entityClasses: {[name: string]: typeof Entity}
}

export function copy(anything: any) {
  return JSON.parse(JSON.stringify(anything))
}

export class Simulator {
  private readonly context: EngineContext
  private readonly entityClasses: {[name: string]: typeof Entity}
  private entities: {[id: string]: Entity} = {}

  constructor(options: SimulatorOptions) {
    this.context = options.context
    this.entityClasses = options.entityClasses
  }

  private nextId = 0
  private generateId(): string {
    return (this.nextId++).toString()
  }

  private getEntityClass(type: string): typeof GenericEntity {
    const Class = <typeof GenericEntity><any>this.entityClasses[type]
    if (!Class) throw new Error(`unknown entity class "${type}"`)
    return Class
  }

  simulate({tick, state, messages}: SimulationInput): SimulationOutput {

    // loop over state entities
    for (const id of Object.keys(state)) {

      // add new entities that have appeared in the state
      if (!(id in this.entities)) {
        const entry = state[id]
        const Entity = this.getEntityClass(entry.type)
        this.entities[id] = new Entity({
          id,
          context: this.context
        })
      }
    }

    // begin aggregating state and messages to output
    const outputState: State = copy(state)
    let outputMessages: Message[] = []

    // loop over entity instances
    for (const id of Object.keys(this.entities)) {
      const entity = this.entities[id]

      // simulate entities which are represented in the state,
      if (id in state) {
        const entry = state[id]
        const result = entity.simulate({
          tick,
          entry,
          messages: messages.filter(message => message.recipient === entity.id)
        })
        outputState.entries[id] = result.entry
        outputMessages = outputMessages.concat(result.messages)
      }

      // remove old entities that are not in the state
      else {
        entity.destructor()
        delete this.entities[id]
      }
    }

    // return aggregated output state and messages
    return {
      state: outputState,
      messages: outputMessages
    }
  }
}

////
//// NETWORKING
////

export interface NetworkOptions {
  context: EngineContext
}

export interface NetworkUpdate extends SimulationOutput {
  state: State
  messages: Message[]
}

export abstract class Network {
  constructor(options: NetworkOptions) {}
  abstract recv(state: State): NetworkUpdate
  abstract send(update: NetworkUpdate)
}
