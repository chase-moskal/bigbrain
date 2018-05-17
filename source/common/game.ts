
import {Engine, Scene, Vector3, CannonJSPlugin} from "babylonjs"

import Susa from "../susa"
import Monarch, {MonarchOptions, StandardContext, EntityClasses} from "../monarch"

export interface GameContext extends Partial<StandardContext> {
	scene: Scene
	window: Window
	canvas: HTMLCanvasElement
}

export interface MakeGameOptions {
	canvas: HTMLCanvasElement
	entityClasses: EntityClasses
}

export interface MakeGameResults {
	monarch: Monarch
	susa: Susa
	engine: Engine
	scene: Scene
}

export function makeGame({canvas, entityClasses}: MakeGameOptions): MakeGameResults {
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine)
	scene.enablePhysics(new Vector3(0, -9.8, 0), new CannonJSPlugin())

	const monarch = new Monarch<GameContext>({
		window,
		entityClasses,
		context: {
			scene,
			window,
			canvas
		}
	})

	const susa = new Susa({engine, scene, window, canvas})
	susa.start()

	return {monarch, susa, engine, scene}
}
