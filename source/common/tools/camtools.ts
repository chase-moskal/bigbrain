
import {Scene, Vector3, FreeCamera, ArcRotateCamera, Quaternion} from "babylonjs"
import * as babylon from "babylonjs"

import {Context} from "../../game"
import {Entity} from "../../entity"
import {Ticker, Tick} from "../../ticker"
import {loadBabylonFile} from "../../toolbox"
import {ThumbstickInfo} from "../tools/thumbstick"
import {Watcher, Input, Bindings, Status} from "../../watcher"
import {Vector, Bearings, StateEntry, Message} from "../../interfaces"

export interface SpectatorEntry extends StateEntry {
	type: "Spectator"
	bearings: Bearings
}

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

export interface RoundCameraRigOptions {
	scene: Scene
	canvas: HTMLCanvasElement
	targetPosition: Vector
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

export const makeActiveCamera = ({scene, position, speed}: {scene: Scene, position: Vector, speed: number}) => {
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

export const traversiveBindings = {
	forward: [Input.W, Input.ArrowUp],
	backward: [Input.S, Input.ArrowDown],
	left: [Input.A, Input.ArrowLeft],
	right: [Input.D, Input.ArrowRight],
	raise: [Input.Space],
	lower: [Input.Z, Input.C],
	sprint: [Input.Shift]
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

export function ascertainDesiredTraversal({watcher}: {watcher: Watcher<typeof traversiveBindings>}): {
	move: Vector3
} {
	let speed = 1
	const control = {...watcher.status}

	if (control.sprint) speed *= 3

	const move = Vector3.Zero()
	if (control.forward) move.z += speed
	if (control.backward) move.z -= speed
	if (control.left) move.x -= speed
	if (control.right) move.x += speed
	if (control.raise) move.y += speed
	if (control.lower) move.y -= speed

	return {
		move
	}
}

export interface PointerMovement {
	x: number
	y: number
}

export function ascertainMovement({
	watcher,
	stickInfo,
	maxSpeed = 1,
	sprintFactor = 3
}: {
	watcher: Watcher<typeof traversiveBindings>
	stickInfo: ThumbstickInfo
	maxSpeed?: number
	sprintFactor?: number
}): babylon.Vector3 {
	const control = {...watcher.status}
	let speed = maxSpeed
	const move = Vector3.Zero()

	// ascertain thumbstick movement
	if (stickInfo && stickInfo.force > 0) {
		const {radian} = stickInfo.angle
		const x = Math.cos(radian)
		const z = Math.sin(radian)
		const force = stickInfo.force < 1
			? stickInfo.force
			: 1
		move.x += x * speed * force
		move.z += z * speed * force
	}

	// ascertain keyboard-based movement
	else {
		if (!control.sprint) speed /= sprintFactor

		if (control.forward) move.z += speed
		if (control.backward) move.z -= speed
		if (control.left) move.x -= speed
		if (control.right) move.x += speed
		if (control.raise) move.y += speed
		if (control.lower) move.y -= speed
	}

	move.normalize()
	return move
}


export function enactMovement({node, move}: {
	node: {
		position: babylon.Vector3
		getWorldMatrix(): babylon.Matrix
	}
	move: babylon.Vector3
}): void {
	node.position = babylon.Vector3.TransformCoordinates(move, node.getWorldMatrix())
}

export function calculateDesiredLook(params: {
	pointerMovement: PointerMovement
	stickInfo: ThumbstickInfo
}): babylon.Quaternion {
	return babylon.Quaternion.Zero()
}
