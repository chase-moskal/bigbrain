
import * as babylon from "@babylonjs/core"
import {RoundCameraRigOptions} from "./toolbox-interfaces.js"

export const createRoundCameraRig = ({
	scene,
	canvas,
	targetPosition,
	radius,
	active
}: RoundCameraRigOptions) => {
	const targetVector = babylon.Vector3.FromArray(targetPosition)
	const name = "camera"
	const alpha = 0
	const beta = 0
	const camera = new babylon.ArcRotateCamera(name, alpha, beta, radius, targetVector, scene)
	camera.attachControl(canvas)
	if (active) scene.activeCamera = camera
	return camera
}
