
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
}

export interface Mandate extends Update {
  state: State
}

export interface MonarchOptions {
  state: State
  context: Context
  network: Network
  simulator: Simulator
}

export default class Monarch {
  private readonly state: State
  private readonly context: Context
  private readonly network: Network
  private readonly simulator: Simulator
  private readonly ticker: Ticker

  constructor(options: MonarchOptions) {
    this.state = options.state
    this.context = options.context
    this.network = options.network
    this.simulator = options.simulator
    this.ticker = new Ticker({action: tick => this.mainloop(tick)})
  }

  start() {
    this.ticker.start()
  }

  stop() {
    this.ticker.stop()
  }

  private mainloop(tick: Tick) {
    const input = this.network.recv(this.state)
    const output = this.simulator.simulate({tick, ...input})
    this.network.send(output)
  }
}
