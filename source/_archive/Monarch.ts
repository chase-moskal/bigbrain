
import {Network} from "./Network"
import Ticker, {Tick} from "./Ticker"
import {EntityClasses} from "./Entity"
import {State, LoopbackNetwork} from "./Network"
import {Service, ServiceMaster} from "./toolbox"
import Simulator, {SimulationOutput} from "./Simulator"

export interface Context {
  readonly host: boolean
}

export interface CreateStandardOptionsProps {
  context: Context
  entityClasses: EntityClasses
  state: State
}

export interface MonarchOptions {
  ticker: Ticker
  network: Network
  simulator: Simulator
  services: Service[]
}

export default class Monarch extends ServiceMaster {

  static createStandardOptions = ({context, entityClasses, state}: CreateStandardOptionsProps) => ({
    ticker: new Ticker(),
    network: new LoopbackNetwork({context, state}),
    simulator: new Simulator({context, entityClasses}),
    services: []
  })

  constructor({ticker, network, simulator, services}: MonarchOptions) {
    ticker.subscribe(tick => network.send(simulator.simulate({tick, ...network.recv()})))
    super([ticker, network, simulator, ...services])
  }
}
