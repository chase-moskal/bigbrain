
import {Context, State} from "./Monarch"
import {SimulationOutput} from "./Simulator"

export interface Message {
  recipient: string
}

export interface NetworkOptions {
  context: Context
}

export interface NetworkUpdate {
  state: State
  messages: Message[]
}

export default class Network {
  private readonly context: Context

  constructor(options: NetworkOptions) {
    this.context = options.context
  }

  recv(state: State): NetworkUpdate {
    return {state, messages: []}
  }

  send(update: NetworkUpdate) {}
}
