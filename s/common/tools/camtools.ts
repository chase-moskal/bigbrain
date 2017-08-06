
import {Scene, Vector3, FreeCamera} from "babylonjs"

export interface RoundCameraRigOptions {
  scene: Scene
}

export class RoundCameraRig {
  private readonly scene
  updatePosition(position: Vector3) {}
}

export const makeCamera = ({scene, position, speed}: {scene: Scene, position: [number, number, number], speed: number}) => {
  const camera = new FreeCamera("Spectator Camera", Vector3.FromArray(position), scene)
  camera.position = Vector3.FromArray(position)
  camera.setTarget(Vector3.Zero())
  camera.speed = speed
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
  if (!camera._localDirection) camera._localDirection = Vector3.Zero()
  if (!camera._transformedDirection) camera._transformedDirection = Vector3.Zero()
  scene.activeCamera = camera
  return camera
}
