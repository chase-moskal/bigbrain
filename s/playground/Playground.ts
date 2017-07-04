
import {Engine, Scene} from "babylonjs"

import Cube from "./Cube"
import Susa from "../Susa"
import Ticker from "../Ticker"
import Simulator from "../Simulator"
import Monarch, {Context} from "../Monarch"
import {Service, ServiceMaster} from "../toolbox"
import {LoopbackNetwork, StateEntry, State} from "../Network"
import {Entity, GenericEntity, EntityClasses, LogicInput, LogicOutput} from "../Entity"

export interface PlaygroundContext extends Context {
  scene: Scene
  canvas: HTMLCanvasElement
}

export abstract class PlaygroundEntity extends Entity<PlaygroundContext> {}

export interface PlaygroundOptions {
  state: State
  window: Window
  canvas: HTMLCanvasElement
  entityClasses: EntityClasses
}

export default class Playground extends ServiceMaster {
  constructor({window, canvas, state, entityClasses}: PlaygroundOptions) {

    // make susa
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const susa = new Susa({window, canvas, engine, scene})

    // make monarch, with susa registered as a service
    const context: PlaygroundContext = {host: true, scene, canvas}
    const ticker = new Ticker()
    const network = new LoopbackNetwork({context, state})
    const simulator = new Simulator({context, entityClasses})
    const monarch = new Monarch({ticker, network, simulator, services: [susa]})

    // monarch is a service of this game
    super([monarch])
  }
}
