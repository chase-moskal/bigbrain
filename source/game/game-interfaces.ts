
import * as babylon from "babylonjs"
import * as cannon from "cannon"

import {OverlayStore} from "../overlay/stores/overlay-store"
import {StandardContext, ConductorOptions} from "../interfaces"

export interface GameContext {
	window: Window
	canvas: HTMLCanvasElement
	overlay: HTMLDivElement
	scene: babylon.Scene
	engine: babylon.Engine
	physicsWorld: cannon.World
	overlayStore: OverlayStore
}

export type Context = StandardContext & GameContext

export interface GameOptions extends ConductorOptions {
	canvas: HTMLCanvasElement
	overlay: HTMLDivElement
	gravity: [number, number, number]
}
