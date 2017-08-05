
import {observable, computed, reaction, autorun} from "mobx"
import {Scene, FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3} from "babylonjs"

import Spectator, {makeCamera, applyLogicalMovement} from "./Spectator"
import Ticker, {Tick} from "../Ticker"
import {loadBabylonFile} from "../Susa"
import {Entity, StateEntry, Message} from "../Monarch"
import Watcher, {Input, Bindings, Status} from "../Watcher"

import {PlaygroundContext} from "./Playground"

export default class Editor extends Entity {
  static readonly bindings: Bindings = {...Spectator.bindings}
  protected readonly context: PlaygroundContext
  private readonly camera: FreeCamera = makeCamera({scene: this.context.scene, position: this.entry.position})
  private readonly watcher = new Watcher({eventTarget: this.context.window, bindings: Editor.bindings})
  private readonly ticker: Ticker = (() => {
    const {camera, watcher} = this
    const ticker = new Ticker({action: tick => applyLogicalMovement({tick, camera, watcher})})
    ticker.start()
    return ticker
  })()
  destructor() {
    this.ticker.destructor()
  }
}
