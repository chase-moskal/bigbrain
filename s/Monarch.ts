
/*

Experimental concept grounds for game engine ideas

  const state = {}
  const context = {host: true}
  const network = new Network({context})
  const simulator = new Simulator({context, entityClasses: {Cube, Horse, Landscape, Spectator}})

  const monarch = new Monarch({state, context, network, simulator})

*/

import Network from "./Network"
import Ticker, {Tick} from "./Ticker"
import Simulator, {SimulationOutput} from "./Simulator"

export interface Context {
  readonly host: boolean
}

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
  messages: Message[]
  state: State
}

export interface MonarchOptions {
  state: State
  context: Context
  network: Network
  simulator: Simulator
}

export default class Monarch {
  private state: State
  private readonly ticker: Ticker
  private readonly context: Context
  private readonly network: Network
  private readonly simulator: Simulator

  constructor(options: MonarchOptions) {
    this.state = options.state
    this.context = options.context
    this.network = options.network
    this.simulator = options.simulator
    this.ticker = new Ticker({action: tick => this.mainloop(tick)})
  }

  destructor() {
    this.simulator.destructor()
  }

  start() {
    this.ticker.start()
  }

  stop() {
    this.ticker.stop()
  }

  private mainloop(tick: Tick) {

    // receive updates from the network
    const {state, messages} = this.network.recv(this.state)

    // update our copy of the state
    this.state = state

    // run the simulation given the update, to produce an outgoing update
    const output = this.simulator.simulate({tick, state, messages})

    // send the outgoing update over the network
    this.network.send(output)
  }
}
