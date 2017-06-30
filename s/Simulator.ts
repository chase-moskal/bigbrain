
import {clone} from "./toolbox"
import {Context} from "./Monarch"
import Ticker, {Tick} from "./Ticker"
import {State, Message, Update} from "./Network"
import {Entity, GenericEntity, EntityClasses} from "./Entity"

export interface SimulationInput extends Update {
  tick: Tick
}

export interface SimulationOutput extends Update {}

export interface SimulatorOptions {
  context: Context
  entityClasses: EntityClasses
}

export default class Simulator {
  private readonly context: Context
  private readonly entityClasses: {[name: string]: typeof Entity}
  private entities: {[id: string]: Entity} = {}

  constructor(options: SimulatorOptions) {
    this.context = options.context
    this.entityClasses = options.entityClasses
  }

  destructor() {
    for (const id of Object.keys(this.entities)) this.entities[id].destructor()
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

    // loop over state entries
    for (const id of Object.keys(state)) {

      // add entities for new entries
      if (!(id in this.entities)) {
        const entry = state[id]
        const Entity = this.getEntityClass(entry.type)
        this.entities[id] = new Entity({
          id,
          context: this.context
        })
      }
    }

    // begin aggregating output state and messages
    const outputState: State = clone(state)
    let outputMessages: Message[] = []

    // loop over entity instances
    for (const id of Object.keys(this.entities)) {
      const entity = this.entities[id]

      // run entities who have state entries
      if (id in state) {
        const entry = state[id]
        const result = entity.run({
          tick,
          entry,
          messages: messages.filter(message => message.recipient === entity.id)
        })
        outputState[id] = result.entry
        outputMessages = outputMessages.concat(result.messages)
      }

      // remove old entities without state entries
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
