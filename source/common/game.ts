
import {Engine, Scene} from "babylonjs"

import Susa from "../susa"
import Monarch, {MonarchOptions, StandardContext, EntityClasses} from "../monarch"

export interface GameContext extends Partial<StandardContext> {
	window: Window
	scene: Scene
	canvas: HTMLCanvasElement
}

export interface MakeGameOptions {
	canvas: HTMLCanvasElement
	entityClasses: EntityClasses
}

export function makeGame({canvas, entityClasses}: MakeGameOptions) {
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine)

	const monarch = new Monarch<GameContext>({
		window,
		entityClasses,
		context: {
			window,
			canvas,
			scene
		}
	})

	const susa = new Susa({window, canvas, engine, scene})
	susa.start()

	return {monarch, susa, engine, scene}
}
