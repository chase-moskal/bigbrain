
import * as babylon from "@babylonjs/core"
import {Vector} from "../interfaces.js"

export interface Service {
	deconstruct(): void
	start(): void
	stop(): void
}

export interface RoundCameraRigOptions {
	scene: babylon.Scene
	canvas: HTMLCanvasElement
	targetPosition: Vector
	radius: number
	active: boolean
}
