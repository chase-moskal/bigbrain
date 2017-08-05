
import {Engine, Scene} from "babylonjs"

import Susa from "../susa"
import Monarch, {Context, State, StateEntry, EntityClasses} from "../monarch"

export interface GameContext extends Context {
  window: Window
  scene: Scene
  canvas: HTMLCanvasElement
  addEntry: (entry: StateEntry) => void
  removeEntry: (id: string) => void
}

export default class Game {
  readonly monarch: Monarch
  readonly susa: Susa

  constructor({window, canvas, entityClasses}: {
    window: Window
    canvas: HTMLCanvasElement
    entityClasses: EntityClasses
  }) {
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)

    const context: GameContext = {
      host: true,
      window, scene, canvas,
      addEntry: entry => this.monarch.addEntry(entry),
      removeEntry: id => this.monarch.removeEntry(id)
    }

    this.monarch = new Monarch({context, entityClasses})
    this.susa = new Susa({window, canvas, engine, scene})
  }
}
