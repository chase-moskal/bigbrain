
import * as babylon from "babylonjs"
import * as cannon from "cannon"

import {MainMenuStore} from "../overlay/stores/main-menu-store"
import {OverlayStore} from "../overlay/stores/overlay-store"
import {StandardContext, ConductorOptions} from "../interfaces"

export interface GameContext {
	window: Window
	scene: babylon.Scene
	engine: babylon.Engine
	canvas: HTMLCanvasElement
	physicsWorld: cannon.World
	overlayStore: OverlayStore
	mainMenuStore: MainMenuStore
	overlayElement: HTMLDivElement
}

export type Context = StandardContext & GameContext

export interface GameOptions extends ConductorOptions {
	canvas: HTMLCanvasElement
	overlayElement: HTMLDivElement
	gravity: [number, number, number]
}
