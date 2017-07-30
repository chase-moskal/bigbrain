
import {observable, computed, reaction, autorun} from "mobx"
import {FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3} from "babylonjs"

import Ticker, {Tick} from "../Ticker"
import {loadBabylonFile} from "../Susa"
import {Entity, StateEntry, Message} from "../Monarch"
import Watcher, {Input, WatcherBindings, WatcherStatus} from "../Watcher"

import {PlaygroundContext} from "./Playground"

export interface SpectatorEntry extends StateEntry {
  type: "Spectator"
  position: [number, number, number]
}

export default class Spectator extends Entity {
  readonly context: PlaygroundContext

  private readonly camera: FreeCamera = (() => {
    const {scene} = this.context
    const camera = new FreeCamera("Spectator Camera", Vector3.FromArray(this.entry.position), scene)
    camera.speed = 0.1
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
    if (!camera._localDirection) camera._localDirection = Vector3.Zero()
    if (!camera._transformedDirection) camera._transformedDirection = Vector3.Zero()
    scene.activeCamera = camera
    return camera
  })()

  private watcher = new Watcher({
    bindings: {
      forward: [Input.W],
      left: [Input.A],
      backward: [Input.S],
      right: [Input.D],
      raise: [Input.E, Input.Space],
      lower: [Input.Q, Input.Z],
      sprint: [Input.Shift]
    }
  })

  private ticker: Ticker = new Ticker({
    action: tick => {
      const {camera} = this
      const control = {...this.watcher.status}

      let speed = camera._computeLocalCameraSpeed() * (tick.timeSinceLastTick / 20)
      if (control.sprint) speed *= 3

      const move = Vector3.Zero()
      if (control.forward) move.z += speed
      if (control.backward) move.z -= speed
      if (control.left) move.x -= speed
      if (control.right) move.x += speed
      if (control.raise) move.y += speed
      if (control.lower) move.y -= speed

      if (camera.getScene().useRightHandedSystem) move.z *= -1
      camera._localDirection.copyFrom(move)
      camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix)
      Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection)
      camera.cameraDirection.addInPlace(camera._transformedDirection)
    }
  })

  constructor(o) {
    super(o)
    this.ticker.start()
  }

  terminate() {
    this.ticker.stop()
    this.ticker.clear()
  }
}
