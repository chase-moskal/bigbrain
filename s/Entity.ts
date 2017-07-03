
import {Tick} from "./Ticker"
import {Context} from "./Monarch"
import {StateEntry, Message} from "./Network"

export interface LogicInput {
  tick: Tick
  entry: StateEntry
  messages: Message[]
}

export interface LogicOutput {
  entry: StateEntry
  messages: Message[]
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
  abstract logic(input: LogicInput): LogicOutput
}

export class GenericEntity extends Entity {
  logic(input: LogicInput): LogicOutput { throw new Error(`generic implementation not for actual use`) }
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
