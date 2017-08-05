
import {observable, computed, reaction, autorun} from "mobx"
import {Scene, FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3} from "babylonjs"

import Ticker, {Tick} from "../../Ticker"
import {loadBabylonFile} from "../../Susa"
import {PlaygroundContext} from "./../Playground"
import {Entity, StateEntry, Message} from "../../Monarch"
import Watcher, {Input, Bindings, Status} from "../../Watcher"

import Spectator, {SpectatorEntry, makeCamera, applyLogicalMovement} from "./Spectator"

export interface EditorEntry {
  type: "Editor"
  position: [number, number, number]
}

export default class Editor extends Entity {
  static readonly bindings: Bindings = {
    ...Spectator.bindings,
    placeEntity: [Input.E],
    selectEntity: [Input.Q]
  }

  protected readonly context: PlaygroundContext
  private readonly camera: FreeCamera = makeCamera({scene: this.context.scene, position: this.entry.position})
  private readonly watcher = new Watcher({eventTarget: this.context.window, bindings: Editor.bindings})
  private readonly ticker: Ticker = (() => {
    const {camera, watcher} = this
    const ticker = new Ticker({action: tick => applyLogicalMovement({tick, camera, watcher})})
    ticker.start()
    return ticker
  })()

  private reactions = [
    reaction(() => this.watcher.status.placeEntity, placeEntity => {
      console.log("place entity", placeEntity)
    }),
    reaction(() => this.watcher.status.selectEntity, selectEntity => {
      console.log("select entity", selectEntity)
    })
  ]

  destructor() {
    this.ticker.destructor()
    for (const dispose of this.reactions) dispose()
    this.watcher.stop()
  }
}
