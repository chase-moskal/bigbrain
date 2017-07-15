
import {Tick} from "./Ticker"
import {Context} from "./Monarch"
import {StateEntry, Message} from "./Network"

export interface LogicInput<
  gStateEntry extends StateEntry = StateEntry,
  gMessage extends Message = Message
> {
  tick: Tick
  entry: gStateEntry
  messages: gMessage[]
}

export interface LogicOutput<
  gStateEntry extends StateEntry = StateEntry,
  gMessage extends Message = Message
> {
  entry: gStateEntry
  messages: gMessage[]
}

export interface EntityOptions<
  gContext extends Context = Context,
  gStateEntry extends StateEntry = StateEntry
> {
  id: string
  context: gContext
  entry: gStateEntry
}

export abstract class Entity<
  gContext extends Context = Context,
  gStateEntry extends StateEntry = StateEntry,
  gMessage extends Message = Message
> {
  readonly id: string
  protected readonly context: gContext

  constructor(options: EntityOptions<gContext, gStateEntry>) {
    this.id = options.id
    this.context = options.context
    this.setup(options.entry)
  }

  async setup(entry: gStateEntry) {}

  destructor() {}

  logic(input: LogicInput<gStateEntry, gMessage>): LogicOutput<gStateEntry, gMessage> {
    return null
  }
}

export class GenericEntity extends Entity {
  logic(input: LogicInput): LogicOutput { throw new Error(`generic implementation not for actual use`) }
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
