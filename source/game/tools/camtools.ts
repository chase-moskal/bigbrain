
import * as babylon from "babylonjs"
import {Scene, Vector3, FreeCamera, ArcRotateCamera} from "babylonjs"

import {Vector, Bearings} from "../../interfaces"

export const makeCamera = ({scene, bearings, speed}: {scene: Scene; bearings: Bearings; speed: number}) => {
	const camera = new FreeCamera("Spectator Camera", Vector3.FromArray(bearings.position), scene)
	camera.position = Vector3.FromArray(bearings.position)
	camera.setTarget(Vector3.Zero())
	camera.speed = speed
	camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
	if (!camera._localDirection) camera._localDirection = Vector3.Zero()
	if (!camera._transformedDirection) camera._transformedDirection = Vector3.Zero()
	scene.activeCamera = camera
	return camera
}

export function makeBasicCamera({scene, bearings}: {
	scene: Scene
	bearings: Bearings
}): babylon.TargetCamera {
	const camera = new babylon.TargetCamera("basic-camera", babylon.Vector3.FromArray(bearings.position), scene)
	scene.activeCamera = camera
	return camera
}

export const makeActiveCamera = ({scene, position, speed}: {
	scene: Scene
	position: Vector
	speed: number
}) => {
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
