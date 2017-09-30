
import {Scene, Vector3, FreeCamera, ArcRotateCamera} from "babylonjs"

export interface RoundCameraRigOptions {
  scene: Scene
  canvas: HTMLCanvasElement
  targetPosition: [number, number, number]
  radius: number
  active: boolean
}

export const createRoundCameraRig = ({
  scene,
  canvas,
  targetPosition,
  radius,
  active
}: RoundCameraRigOptions) => {
  const targetVector = Vector3.FromArray(targetPosition)
  const name = "camera"
  const alpha = 0
  const beta = 0
  const camera = new ArcRotateCamera(name, alpha, beta, radius, targetVector, scene)
  camera.attachControl(canvas)
  if (active) scene.activeCamera = camera
  return camera
}

export const makeActiveCamera = ({scene, position, speed}: {scene: Scene, position: [number, number, number], speed: number}) => {
  const camera = new FreeCamera("camera", Vector3.FromArray(position), scene)
  camera.position = Vector3.FromArray(position)
  camera.setTarget(Vector3.Zero())
  camera.speed = speed
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
  if (!camera._localDirection) camera._localDirection = Vector3.Zero()
  if (!camera._transformedDirection) camera._transformedDirection = Vector3.Zero()
  scene.activeCamera = camera
  return camera
}
