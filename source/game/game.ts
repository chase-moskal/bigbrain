
import * as cannon from "cannon"
import * as babylon from "babylonjs"

import {GameOptions, GameContext} from "./game-interfaces"

import {Susa} from "../susa"
import {Ticker} from "../ticker"
import {Service} from "../toolbox"
import {Manager} from "../manager"
import {Conductor} from "../conductor"

/**
 * Standard monarch game
 */
export class Game implements Service {
	readonly manager: Manager
	private readonly susa: Susa
	private readonly logicTicker: Ticker

	constructor(options: GameOptions) {
		const {overlay, canvas, mode, entityClasses, gravity} = options

		// babylon engine as the foundation
		const engine = new babylon.Engine(canvas, true, undefined, true)
		const scene = new babylon.Scene(engine)

		// cannon physics enabled
		const physicsPlugin = new babylon.CannonJSPlugin()
		const physicsWorld: cannon.World = physicsPlugin.world
		scene.enablePhysics(babylon.Vector3.FromArray(gravity), physicsPlugin)

		// susa handles the viewport, pointer lock
		const susa = this.susa = new Susa({
			window,
			canvas,
			scene,
			engine
		})
		susa.start()

		// 2d overlay
		overlay.innerHTML = `
			<div class="thumbsticks">
				<div class="stick1"></div>
				<div class="stick2"></div>
			</div>
		`

		// conductor keeps gamestate and entity replication
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

		// create a logic loop ticker which runs the conductor's logic routine
		const logicTicker = new Ticker({
			tickAction: tick => conductor.logic(tick)
		})

		// expose the state manager
		this.manager = conductor.manager
	}

	start() {
		this.logicTicker.start()
		this.susa.start()
	}

	stop() {
		this.logicTicker.stop()
		this.susa.stop()
	}

	destructor() {
		this.logicTicker.destructor()
		this.susa.destructor()
	}
}
