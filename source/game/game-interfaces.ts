
import * as babylon from "babylonjs"
import * as cannon from "cannon"

import {StandardContext, ConductorOptions} from "../interfaces"

export interface GameContext {
	window: Window
	canvas: HTMLCanvasElement
	overlay: HTMLDivElement
	scene: babylon.Scene
	engine: babylon.Engine
	physicsWorld: cannon.World
}

export type Context = StandardContext & GameContext

export interface GameOptions extends ConductorOptions {
	canvas: HTMLCanvasElement
	overlay: HTMLDivElement
	gravity: [number, number, number]
}
