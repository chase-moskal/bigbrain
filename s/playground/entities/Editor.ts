
import {observable, computed, reaction, autorun} from "mobx"
import {Scene, FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3, StandardMaterial} from "babylonjs"

import Ticker, {Tick} from "../../Ticker"
import {loadBabylonFile} from "../../Susa"
import {PlaygroundContext} from "./../Playground"
import {Entity, StateEntry, Message} from "../../Monarch"
import Watcher, {Input, Bindings, Status} from "../../Watcher"

import {CubeEntry, createCubeMesh, IdentifiableMesh} from "./Cube"
import {makeCamera, applyLogicalMovement, bindings as spectatorBindings} from "./Spectator"

export interface EditorEntry {
  type: "Editor"
  position: [number, number, number]
}

export default class Editor extends Entity<PlaygroundContext, EditorEntry> {
  static readonly bindings = {
    ...spectatorBindings,
    ghost: [Input.E],
    place: [Input.MouseLeft],
    remove: [Input.X, Input.Backspace, Input.Delete]
  }

  protected readonly context: PlaygroundContext

  private readonly watcher = new Watcher<typeof Editor.bindings, {
    ghost: boolean
    place: boolean
    remove: boolean
  }>({eventTarget: this.context.window, bindings: Editor.bindings})

  private readonly camera: FreeCamera = makeCamera({scene: this.context.scene, position: this.entry.position})

  private readonly ticker: Ticker = (() => {
    const {camera, watcher} = this
    const ticker = new Ticker({action: tick => applyLogicalMovement({tick, camera, watcher})})
    ticker.start()
    return ticker
  })()

  get aimpoint() {
    const {scene, canvas} = this.context
    const {pickedPoint: aimpoint} = scene.pick(canvas.width / 2, canvas.height / 2)
    return aimpoint
  }

  private middlePick() {
    const {scene, canvas} = this.context
    return scene.pick(canvas.width / 2, canvas.height / 2)
  }

  private ghostMesh: Mesh = null
  private readonly ghostTicker = new Ticker({
    action: tick => {
      const {aimpoint, ghostMesh} = this
      if (aimpoint) aimpoint.y += 0.5
      this.ghostMesh.position = aimpoint || Vector3.Zero()
    }
  })

  private reactions = [

    // ghost mode
    reaction(() => this.watcher.status.ghost, ghost => {
      if (ghost) {
        if (!this.ghostMesh) {
          const {scene} = this.context
          const {aimpoint} = this
          const position = <[number, number, number]>(aimpoint ? aimpoint.asArray() : [0, 0, 0])
          const mesh = createCubeMesh({scene, size: 1, position})
          mesh.material.wireframe = true
          mesh.isPickable = false
          mesh.position.y += 0.5
          this.ghostMesh = mesh
          this.ghostTicker.start()
        }
      }
      else {
        this.ghostTicker.stop()
        if (this.ghostMesh) {
          this.ghostMesh.dispose()
          this.ghostMesh = null
        }
      }
    }),

    // placement action
    reaction(() => this.watcher.status.place, place => {
      const {scene, canvas, addEntry} = this.context
      const {ghostMesh} = this
      if (place && ghostMesh) {
        addEntry(<CubeEntry>{type: "Cube", size: 1, position: ghostMesh.position.asArray()})
      }
    }),

    // removal action
    reaction(() => this.watcher.status.remove, remove => {
      const {scene, canvas, addEntry, removeEntry} = this.context
      if (remove) {
        const pick = this.middlePick()
        if (pick && pick.pickedMesh) {
          const mesh = <IdentifiableMesh>pick.pickedMesh
          if (mesh.entryId) removeEntry(mesh.entryId)
        }
      }
    })
  ]

  destructor() {
    this.watcher.destructor()
    this.ticker.destructor()
    for (const dispose of this.reactions) dispose()
  }
}
