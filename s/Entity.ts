
import {Tick} from "./Ticker"
import {Context} from "./Monarch"
import {StateEntry, Message} from "./Network"

export interface LogicInput<gEntry extends StateEntry = StateEntry, gMessage extends Message = Message> {
  tick: Tick
  entry: gEntry
  messages: gMessage[]
}

export interface LogicOutput<gEntry extends StateEntry = StateEntry, gMessage extends Message = Message> {
  entry: gEntry
  messages: gMessage[]
}

export abstract class Entity<gContext extends Context = Context> {
  readonly id: string
  protected readonly context: gContext

  constructor(options: {
    id: string
    context: gContext
  }) {
    this.id = options.id
    this.context = options.context
  }

  destructor() {}
  logic(input: LogicInput): LogicOutput {
    return null
  }
}

export class GenericEntity extends Entity {
  logic(input: LogicInput): LogicOutput { throw new Error(`generic implementation not for actual use`) }
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
