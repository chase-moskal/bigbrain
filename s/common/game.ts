
import {Engine, Scene} from "babylonjs"

import Susa from "../susa"
import Monarch, {MonarchOptions, StandardContext} from "../monarch"

export interface GameSpecifics {
  window: Window
  scene: Scene
  canvas: HTMLCanvasElement
}

export interface Context extends GameSpecifics, StandardContext {}

export default class Game extends Monarch<GameSpecifics> {
  constructor(options: MonarchOptions) {
    const {window, canvas} = options

    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)

    super({...options, context: {window, scene, canvas}})

    const susa = new Susa({window, canvas, engine, scene})
    susa.start()
  }
}
