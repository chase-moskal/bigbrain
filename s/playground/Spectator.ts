
import * as deepFreeze from "deep-freeze"
import {observable, computed, reaction, autorun} from "mobx"
import {Scene, FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3} from "babylonjs"

import Ticker, {Tick} from "../Ticker"
import {loadBabylonFile} from "../Susa"
import {Entity, StateEntry, Message} from "../Monarch"
import Watcher, {Input, Bindings, Status} from "../Watcher"

import {PlaygroundContext} from "./Playground"

export interface SpectatorEntry extends StateEntry {
  type: "Spectator"
  position: [number, number, number]
}

export const makeCamera = ({scene, position}: {scene: Scene, position: [number, number, number]}) => {
  const camera = new FreeCamera("Spectator Camera", Vector3.FromArray(position), scene)
  camera.setTarget(Vector3.Zero())
  camera.speed = 0.1
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
  if (!camera._localDirection) camera._localDirection = Vector3.Zero()
  if (!camera._transformedDirection) camera._transformedDirection = Vector3.Zero()
  scene.activeCamera = camera
  return camera
}

export const applyLogicalMovement = ({tick, camera, watcher}: {tick: Tick, camera: FreeCamera, watcher: Watcher}) => {
  const control = {...watcher.status}

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

export default class Spectator extends Entity {
  static readonly bindings: Bindings = deepFreeze({
    forward: [Input.W, Input.ArrowUp],
    backward: [Input.S, Input.ArrowDown],
    left: [Input.A, Input.ArrowLeft],
    right: [Input.D, Input.ArrowRight],
    raise: [Input.Space],
    lower: [Input.Z, Input.C],
    sprint: [Input.Shift]
  })
  protected readonly context: PlaygroundContext
  private readonly camera: FreeCamera = makeCamera({scene: this.context.scene, position: this.entry.position})
  private readonly watcher = new Watcher({eventTarget: this.context.window, bindings: {...Spectator.bindings}})
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
