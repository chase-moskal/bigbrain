
import * as cannon from "cannon"
import * as babylon from "babylonjs"

import {Susa} from "./susa"
import {Manager} from "./manager"
import {StandardContext} from "./interfaces"
import {Conductor, ConductorOptions} from "./conductor"

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

/**
 * Standard monarch game
 */
export class Game {
	readonly manager: Manager

	constructor(options: GameOptions) {
		const {overlay, canvas, mode, entityClasses, gravity} = options

		const engine = new babylon.Engine(canvas, true, undefined, true)
		const scene = new babylon.Scene(engine)

		const physicsPlugin = new babylon.CannonJSPlugin()
		const physicsWorld: cannon.World = physicsPlugin.world
		scene.enablePhysics(babylon.Vector3.FromArray(gravity), physicsPlugin)

		const susa = new Susa({
			window,
			canvas,
			scene,
			engine
		})

		overlay.innerHTML = `
			<div class="thumbsticks">
				<div class="stick1"></div>
				<div class="stick2"></div>
			</div>
		`

		susa.start()

		const conductor = new Conductor<GameContext>({
			mode,
			entityClasses,
			context: {
				window,
				canvas,
				overlay,
				scene,
				engine,
				physicsWorld
			}
		})

		this.manager = conductor.manager
	}
}
