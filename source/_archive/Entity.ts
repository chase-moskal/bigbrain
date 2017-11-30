
import {Tick} from "./Ticker"
import {Context} from "./Monarch"
import {State, StateEntry, Message} from "./Network"

export interface EntityOptions<
  gContext extends Context = Context,
  gStateEntry extends StateEntry = StateEntry
> {
  id: string
  context: gContext
  state: State<gStateEntry>
}

export abstract class Entity<
  gContext extends Context = Context,
  gStateEntry extends StateEntry = StateEntry,
  gMessage extends Message = Message
> {
  readonly id: string
  protected readonly context: gContext

  private readonly state: State<gStateEntry>
  protected get entry(): gStateEntry { return this.state[this.id] }

  constructor(options: EntityOptions<gContext, gStateEntry>) {
    this.id = options.id
    this.context = options.context
    this.state = options.state
    this.initialize()
  }

  abstract initialize(): void
  abstract terminate(): void
}

export class GenericEntity extends Entity {
  initialize() {}
  terminate() {}
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
