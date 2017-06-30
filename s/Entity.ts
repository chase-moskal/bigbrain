
import {Tick} from "./Ticker"
import {Context} from "./Monarch"
import {StateEntry, Message} from "./Network"

export interface EntityOptions {
  id: string
  context: Context
}

export abstract class Entity {
  readonly id: string
  protected readonly context: Context

  constructor(options: EntityOptions) {
    this.id = options.id
    this.context = options.context
  }

  abstract run(input: EntityRunInput): EntityRunOutput
  abstract destructor()
}

export interface EntityRunInput {
  tick: Tick
  entry: StateEntry
  messages: Message[]
}

export interface EntityRunOutput {
  entry: StateEntry
  messages: Message[]
}

export class GenericEntity extends Entity {
  run(input: EntityRunInput): EntityRunOutput { throw new Error(`generic implementation not for actual use`) }
  destructor() { throw new Error(`generic implementation not for actual use`) }
}

export type EntityClasses = {[name: string]: typeof Entity}
