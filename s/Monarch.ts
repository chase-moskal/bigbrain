
import {Network} from "./Network"
import Ticker, {Tick} from "./Ticker"
import {Service, ServiceMaster} from "./toolbox"
import Simulator, {SimulationOutput} from "./Simulator"

export interface Context {
  readonly host: boolean
}

export interface MonarchOptions {
  ticker: Ticker
  network: Network
  simulator: Simulator
  services?: Service[]
}

export default class Monarch extends ServiceMaster {
  private readonly ticker: Ticker
  private readonly network: Network
  private readonly simulator: Simulator

  constructor({ticker, network, simulator, services = []}: MonarchOptions) {
    super([...services, ticker, network, simulator])
    this.network = network
    this.simulator = simulator
    ticker.subscribe(tick => this.mainloop(tick))
  }

  private mainloop(tick: Tick) {
    const {network, simulator} = this
    network.send(simulator.simulate({tick, ...network.recv()}))
  }
}
