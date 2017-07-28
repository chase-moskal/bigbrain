
import {Engine, Scene} from "babylonjs"

import Susa from "../Susa"
import {ServiceMaster} from "../toolbox"
import Monarch, {Context, State, EntityClasses} from "../Monarch"

export interface PlaygroundContext extends Context {
  scene: Scene
  canvas: HTMLCanvasElement
}

export default class Playground extends Monarch {
  readonly susa: Susa

  constructor({window, canvas, entityClasses}: {
    window: Window
    canvas: HTMLCanvasElement
    entityClasses: EntityClasses
  }) {
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)

    const context: PlaygroundContext = {host: true, scene, canvas}
    super(context, entityClasses)

    this.susa = new Susa({window, canvas, engine, scene})
  }
}
