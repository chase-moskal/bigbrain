
import {World} from "cannon"
import {Engine, Scene, Vector3, CannonJSPlugin} from "babylonjs"

import {Susa} from "../susa"
import {Monarch} from "../monarch"
import {EntityClasses} from "../entity"
import {MonarchContext} from "../interfaces"

export interface GameContext {
	scene: Scene
	window: Window
	hud: HTMLDivElement
	physicsWorld: World
	canvas: HTMLCanvasElement
}

export type Context = MonarchContext & GameContext

export interface MakeGameOptions {
	hud: HTMLDivElement
	canvas: HTMLCanvasElement
	entityClasses: EntityClasses
}

export interface MakeGameResults {
	monarch: Monarch
	susa: Susa
	engine: Engine
	scene: Scene
}

export function makeGame({canvas, hud, entityClasses}: MakeGameOptions): MakeGameResults {
	const engine = new Engine(canvas, true)
	const scene = new Scene(engine)
	const physicsPlugin = new CannonJSPlugin()
	const physicsWorld = physicsPlugin.world

	const monarch = new Monarch<GameContext>({
		window,
		entityClasses,
		context: {
			scene,
			window,
			canvas,
			hud,
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

	return {monarch, susa, engine, scene}
}
