
import * as babylon from "@babylonjs/core"
import {Vector, Bearings} from "../../core/interfaces.js"

export const makeCamera = ({scene, bearings, speed}: {scene: babylon.Scene; bearings: Bearings; speed: number}) => {
	const camera = new babylon.FreeCamera("Spectator Camera", babylon.Vector3.FromArray(bearings.position), scene)
	camera.position = babylon.Vector3.FromArray(bearings.position)
	camera.setTarget(babylon.Vector3.Zero())
	camera.speed = speed
	camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
	if (!camera._localDirection) camera._localDirection = babylon.Vector3.Zero()
	if (!camera._transformedDirection) camera._transformedDirection = babylon.Vector3.Zero()
	scene.activeCamera = camera
	return camera
}

export function makeBasicCamera({scene, bearings}: {
	scene: babylon.Scene
	bearings: Bearings
}): babylon.TargetCamera {
	const camera = new babylon.TargetCamera("basic-camera", babylon.Vector3.FromArray(bearings.position), scene)
	scene.activeCamera = camera
	return camera
}

export const makeActiveCamera = ({scene, position, speed}: {
	scene: babylon.Scene
	position: Vector
	speed: number
}) => {
	const camera = new babylon.FreeCamera("camera", babylon.Vector3.FromArray(position), scene)
	camera.position = babylon.Vector3.FromArray(position)
	camera.setTarget(babylon.Vector3.Zero())
	camera.speed = speed
	camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
	if (!camera._localDirection) camera._localDirection = babylon.Vector3.Zero()
	if (!camera._transformedDirection) camera._transformedDirection = babylon.Vector3.Zero()
	scene.activeCamera = camera
	return camera
}
