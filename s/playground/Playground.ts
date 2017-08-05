
import {Engine, Scene} from "babylonjs"

import Susa from "../Susa"
import {ServiceMaster} from "../toolbox"
import Monarch, {Context, State, StateEntry, EntityClasses} from "../Monarch"

export interface PlaygroundContext extends Context {
  window: Window
  scene: Scene
  canvas: HTMLCanvasElement
  addEntry: (entry: StateEntry) => void
}

export default class Playground {
  readonly monarch: Monarch
  readonly susa: Susa

  constructor({window, canvas, entityClasses}: {
    window: Window
    canvas: HTMLCanvasElement
    entityClasses: EntityClasses
  }) {
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)

    const context: PlaygroundContext = {
      host: true,
      window, scene, canvas,
      addEntry: entry => this.monarch.addEntry(entry)
    }

    this.monarch = new Monarch({context, entityClasses})
    this.susa = new Susa({window, canvas, engine, scene})
  }
}
