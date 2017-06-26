
import {SimulationOutput} from "./Simulator"
import {Context, State, Message, Update} from "./Monarch"

export interface NetworkOptions {
  context: Context
}

export default class Network {
  private readonly context: Context

  constructor(options: NetworkOptions) {
    this.context = options.context
  }

  recv(state: State): Update {
    return {state, messages: []}
  }

  send(update: Update) {}
}
