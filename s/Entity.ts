
import {Tick} from "./Ticker"
import {Context} from "./Monarch"
import {StateEntry, Message} from "./Network"

export interface EntityOptions {
  id: string
  context: Context
}

export interface LogicInput {
  tick: Tick
  entry: StateEntry
  messages: Message[]
}

export interface LogicOutput {
  entry: StateEntry
  messages: Message[]
}

export abstract class Entity {
  readonly id: string
  protected readonly context: Context

  constructor(options: EntityOptions) {
    this.id = options.id
    this.context = options.context
  }

  abstract logic(input: LogicInput): LogicOutput
  destructor() {}
}

export class GenericEntity extends Entity {
  logic(input: LogicInput): LogicOutput { throw new Error(`generic implementation not for actual use`) }
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
