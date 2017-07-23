
import {observable} from "mobx"

import {Service} from "./toolbox"
import {Context} from "./Monarch"
import {SimulationOutput} from "./Simulator"

export interface StateEntry {}

// export class StateEntry {
//   constructor(public readonly id: string) {}
// }

export interface State<gStateEntry extends StateEntry = StateEntry> {
  entries: { [id: string]: gStateEntry }
}

export const createObservableState = (): State => observable({entries: {}})

export interface Message {
  recipient: string
}

export interface Update<gMessage extends Message = Message> {
  state?: State
  messages: gMessage[]
}

export interface NetworkOptions {
  context: Context
  state: State
}

export abstract class Network implements Service {
  protected state: State
  protected readonly context: Context

  constructor(options: NetworkOptions) {
    this.state = options.state
    this.context = options.context
  }

  destructor() {}
  start() {}
  stop() {}

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
