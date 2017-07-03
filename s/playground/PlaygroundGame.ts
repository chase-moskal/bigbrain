
import {Engine, Scene} from "babylonjs"

import Dog from "./Dog"
import Susa from "../Susa"
import Ticker from "../Ticker"
import Simulator from "../Simulator"
import Monarch, {Context} from "../Monarch"
import {Service, ServiceMaster} from "../toolbox"
import {LoopbackNetwork, StateEntry} from "../Network"
import {Entity, GenericEntity, EntityClasses, LogicInput, LogicOutput} from "../Entity"

export interface PlaygroundContext extends Context {
  scene: Scene
}

export default class PlaygroundGame extends ServiceMaster {
  constructor(canvas: HTMLCanvasElement) {

    // make susa
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const susa = new Susa({canvas, engine, scene})

    // make monarch, with susa registered as a service
    const context: PlaygroundContext = {host: true, scene}
    const ticker = new Ticker()
    const network = new LoopbackNetwork({context: <PlaygroundContext>{host: true, scene}, state: {}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({ticker, network, simulator, services: [susa]})

    // monarch is a service of this game
    super([monarch])
  }
}
