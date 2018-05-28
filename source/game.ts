
import {World} from "cannon"
import {Engine, Scene, Vector3, CannonJSPlugin} from "babylonjs"

import {Susa} from "./susa"
import {Manager} from "./manager"
import {EntityClasses} from "./entity"
import {Conductor, ConductorOptions} from "./conductor"
import {StandardContext, OrchestrationMode} from "./interfaces"

export interface GameContext {
	scene: Scene
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

		const engine = new Engine(canvas, undefined, undefined, true)
		const scene = new Scene(engine)
		const physicsPlugin = new CannonJSPlugin()
		const physicsWorld = physicsPlugin.world

		overlay.innerHTML = `
			<div class="thumbsticks">
				<div class="leftstick"></div>
				<div class="rightstick"></div>
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
