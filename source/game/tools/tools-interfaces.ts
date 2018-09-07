
import * as babylon from "babylonjs"

import {Watcher} from "../../watcher"
import {Vector} from "../../interfaces"

import {traversiveBindings} from "./traversal"

export interface RoundCameraRigOptions {
	scene: babylon.Scene
	canvas: HTMLCanvasElement
	targetPosition: Vector
	radius: number
	active: boolean
}

export interface NippleData {
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

export type MoveHandler = (info: ThumbstickInfo) => void

export interface ThumbstickOptions {
	zone: HTMLElement
	onMove?: MoveHandler
}

export interface ThumbstickInfo {
	angle: number
	force: number
}

export interface MovementInputs {
	watcher: Watcher<typeof traversiveBindings>
	stickInfo: ThumbstickInfo
	maxSpeed?: number
	timeFactor?: number
	sprintFactor?: number
}

export interface MovableNode extends babylon.Node {
	position: babylon.Vector3
}

export interface RotatableNode extends babylon.Node {
	rotationQuaternion: babylon.Quaternion
}