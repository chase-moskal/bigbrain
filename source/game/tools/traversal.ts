
import * as babylon from "babylonjs"

import {Input} from "../../watcher"
import {getVectorMagnitude} from "../../toolbox"

import {
	ThumbstickInfo,
	MovementInputs,
	MovableNode
} from "./tools-interfaces"

export const traversiveBindings = {
	forward: [Input.W, Input.ArrowUp],
	backward: [Input.S, Input.ArrowDown],
	left: [Input.A, Input.ArrowLeft],
	right: [Input.D, Input.ArrowRight],
	raise: [Input.Space],
	lower: [Input.Z, Input.C],
	sprint: [Input.Shift]
}

export function ascertainMovement({
	watcher,
	stickInfo,
	maxSpeed = 1,
	timeFactor = 1,
	sprintFactor = 3
}: MovementInputs): babylon.Vector3 {
	let speed = maxSpeed * timeFactor
	const control = {...watcher.status}
	const move = babylon.Vector3.Zero()

	// ascertain thumbstick movement
	if (stickInfo && stickInfo.force > 0) {
		const {angle, force} = stickInfo
		const x = Math.cos(angle)
		const z = Math.sin(angle)
		const appliedForce = force < 1
			? force
			: 1
		move.x += x * speed * appliedForce
		move.z += z * speed * appliedForce
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

	if (getVectorMagnitude(move) > 1)
		move.normalize()

	return move
}

export function enactMovement({node, move}: {
	node: MovableNode
	move: babylon.Vector3
}): void {
	node.position = babylon.Vector3.TransformCoordinates(move, node.getWorldMatrix())
}

export function ascertainLook(params: {
	event: MouseEvent
	stickInfo: ThumbstickInfo
}): babylon.Quaternion {
	return babylon.Quaternion.Zero()
}
