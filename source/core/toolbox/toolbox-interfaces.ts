
import babylon from "../../babylon"
import {Vector} from "../interfaces"

export interface Service {
	destructor(): void
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
