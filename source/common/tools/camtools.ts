
import {Scene, Vector3, FreeCamera, ArcRotateCamera, Quaternion} from "babylonjs"
import * as babylon from "babylonjs"

import {Context} from "../../game"
import {Entity} from "../../entity"
import {Ticker, Tick} from "../../ticker"
import {loadBabylonFile} from "../../toolbox"
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

/**
 * ASCERTAIN FREE WILL PARAMS
 * - user inputs relating to movement and mouselook
 */
export interface AscertainFreeWillParams {

	// watcher for movement buttons like forward, backward, etc
	watcher: Watcher<typeof traversiveBindings>

	// pointer lock api information about cursor movement
	pointerMovement: PointerMovement

	// thumbstick data
	stickInfo: {
		moveStickInfo: ThumbstickInfo
		lookStickInfo: ThumbstickInfo
	}
}

/**
 * FREE WILL
 * - positional and rotational changes for which the player wishes
 */
export interface FreeWill {
	move: babylon.Vector3
	look: babylon.Quaternion
}

export function ascertainFreeWill({watcher, pointerMovement, stickInfo}: AscertainFreeWillParams): FreeWill {
	const {moveStickInfo, lookStickInfo} = stickInfo
	const move = calculateDesiredMove({watcher, stickInfo: moveStickInfo})
	const look = calculateDesiredLook({pointerMovement, stickInfo: lookStickInfo})
	return {move, look}
}

export interface EnactFreeWillParams {
	node: babylon.Node & {
		position?: babylon.Vector3
		rotation?: babylon.Quaternion
	}
	freeWill: FreeWill
}

export function enactFreeWill({node, freeWill}: EnactFreeWillParams): void {
	const {move, look} = freeWill
	if (node.position) node.position.addInPlace(move)
	if (node.rotation) node.rotation.addInPlace(look)
}

export interface ThumbstickInfo {
	angle: {
		radian: number
		degree: number
	}
	direction: {x?: string; y?: string; angle: string}
	force: number
	identifier: number
	instance: any
	position: {x: number; y: number}
	pressure: number
}

export function calculateDesiredMove(params: {
	watcher: Watcher<typeof traversiveBindings>
	stickInfo: ThumbstickInfo
}): babylon.Vector3 {
	return babylon.Vector3.Zero()
}

export function calculateDesiredLook(params: {
	pointerMovement: PointerMovement
	stickInfo: ThumbstickInfo
}): babylon.Quaternion {
	return babylon.Quaternion.Zero()
}

export interface MovementDesires {
	localMove: Vector3
}

export interface MouselookDesires {
	localLook: babylon.Quaternion
}
