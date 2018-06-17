
import {World} from "cannon"
import * as babylon from "babylonjs"

import {Susa} from "./susa"
import {Manager} from "./manager"
import {StandardContext} from "./interfaces"
import {Conductor, ConductorOptions} from "./conductor"

export interface GameContext {
	scene: babylon.Scene
	window: Window
	physicsWorld: World
	overlay: HTMLDivElement
	canvas: HTMLCanvasElement
}

export type Context = StandardContext & GameContext

export interface GameOptions extends ConductorOptions {
	overlay: HTMLDivElement
	canvas: HTMLCanvasElement
}

export class Game extends Conductor {
	readonly manager: Manager

	constructor(options: GameOptions) {
		super(options)
		const {overlay, canvas, mode, entityClasses} = options

		const engine = new babylon.Engine(canvas, undefined, undefined, true)
		const scene = new babylon.Scene(engine)
		const physicsPlugin = new babylon.CannonJSPlugin()
		const physicsWorld = physicsPlugin.world

		overlay.innerHTML = `
			<div class="thumbsticks">
				<div class="stick1"></div>
				<div class="stick2"></div>
			</div>
		`

		const conductor = new Conductor<GameContext>({
			mode,
			entityClasses,
			context: {
				scene,
				window,
				canvas,
				overlay,
				physicsWorld
			}
		})

		const susa = new Susa({
			engine,
			scene,
			window,
			canvas,
			physics: {
				gravity: [0, -9.8, 0],
				plugin: physicsPlugin
			}
		})

		susa.start()

		this.manager = conductor.manager
	}
}
