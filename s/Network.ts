
import {Context} from "./Monarch"
import {SimulationOutput} from "./Simulator"

export interface StateEntry {
  type: string
}

export interface State {
  [id: string]: StateEntry
}

export interface Message {
  recipient: string
}

export interface Update {
  state?: State
  messages: Message[]
}

export interface NetworkOptions {
  context: Context
  state: State
}

export abstract class Network {
  protected state: State
  protected readonly context: Context

  constructor(options: NetworkOptions) {
    this.state = options.state
    this.context = options.context
  }

  abstract recv(): Update

  abstract send(update: Update): void
}

export class LoopbackNetwork extends Network {
  protected state: State
  private inbox: Message[] = []

  recv(): Update {
    const messages = this.inbox
    this.inbox = []
    return {
      state: this.state,
      messages
    }
  }

  send({state, messages}: Update) {
    this.state = state
    this.inbox = [...this.inbox, ...messages]
  }
}
