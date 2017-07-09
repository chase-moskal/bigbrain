
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

export interface EntityOptions<gContext extends Context = Context> {
  id: string
  context: gContext
}

export abstract class Entity<gContext extends Context = Context, gStateEntry extends StateEntry = StateEntry, gMessage extends Message = Message> {
  readonly id: string
  protected readonly context: gContext

  constructor(options: EntityOptions<gContext>) {
    this.id = options.id
    this.context = options.context
  }

  destructor() {}
  logic(input: LogicInput<gStateEntry, gMessage>): LogicOutput<gStateEntry, gMessage> {
    return null
  }
}

export class GenericEntity extends Entity {
  logic(input: LogicInput): LogicOutput { throw new Error(`generic implementation not for actual use`) }
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
