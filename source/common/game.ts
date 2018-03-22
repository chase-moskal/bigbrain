
import {Engine, Scene} from "babylonjs"

import Susa from "../susa"
import Physics from "../physics"
import {Ammo, AmmoModule, loadAmmo} from "../physics/ammo-liaison"
import Monarch, {MonarchOptions, StandardContext, EntityClasses} from "../monarch"

export interface GameContext extends Partial<StandardContext> {
	scene: Scene
	physics: Physics
	window: Window
	canvas: HTMLCanvasElement
}

export interface MakeGameOptions {
	ammo: typeof Ammo
	canvas: HTMLCanvasElement
	entityClasses: EntityClasses
}

export interface MakeGameResults {
	monarch: Monarch
	susa: Susa
	engine: Engine
	scene: Scene
	physics: Physics
}

export function makeGame({ammo, canvas, entityClasses}: MakeGameOptions): MakeGameResults {
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine)
	const physics = new Physics({ammo})

	const monarch = new Monarch<GameContext>({
		window,
		entityClasses,
		context: {
			scene,
			physics,
			window,
			canvas
		}
	})

	const susa = new Susa({engine, scene, physics, window, canvas})
	susa.start()

	return {monarch, susa, engine, scene, physics}
}
