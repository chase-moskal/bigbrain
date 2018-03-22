
import {Engine, Scene} from "babylonjs"

import Susa from "../susa"
import Physics from "../physics"
import Monarch, {MonarchOptions, StandardContext, EntityClasses} from "../monarch"

export interface GameContext extends Partial<StandardContext> {
	scene: Scene
	physics: Physics
	window: Window
	canvas: HTMLCanvasElement
}

export interface MakeGameOptions {
	canvas: HTMLCanvasElement
	entityClasses: EntityClasses
}

export function makeGame({canvas, entityClasses}: MakeGameOptions) {
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine)
	const physics = new Physics()

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
