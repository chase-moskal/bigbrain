
import {Network} from "./Network"
import Ticker, {Tick} from "./Ticker"
import Simulator, {SimulationOutput} from "./Simulator"

export interface Context {
  readonly host: boolean
}

export interface MonarchOptions {
  ticker: Ticker
  context: Context
  network: Network
  simulator: Simulator
}

export default class Monarch {
  private readonly ticker: Ticker
  private readonly context: Context
  private readonly network: Network
  private readonly simulator: Simulator

  constructor(options: MonarchOptions) {
    this.ticker = options.ticker
    this.context = options.context
    this.network = options.network
    this.simulator = options.simulator
    this.ticker.subscribe(tick => this.mainloop(tick))
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
    const {state, messages} = this.network.recv()

    // run the simulation given the update, to produce an outgoing update
    const output = this.simulator.simulate({tick, state, messages})

    // send the outgoing update over the network
    this.network.send(output)
  }
}
