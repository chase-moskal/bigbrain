
import {Scene, Engine, PickingInfo, Camera, Vector3, IPhysicsEnginePlugin} from "babylonjs"

import {Vector} from "./interfaces"
import {now, Service} from "./toolbox"

/**
 * SUSA GAME WORLD CLASS
 *  - establishes a 3d babylon game world scene
 *  - manages html dom event bindings for input locking
 *  - coordinates game physics through babylon
 */
export class Susa implements Service {
	private readonly scene: Scene
	private readonly engine: Engine
	private readonly window: Window
	private readonly canvas: HTMLCanvasElement

	private readonly fallbackCamera: Camera
	private active: boolean = false
	private pick: PickingInfo = new PickingInfo()
	private lastFrameTime = now()

	private readonly listeners: { [eventName: string]: () => void } = {

		resize: () => {
			this.engine.resize()
		},

		mousemove: () => {
			this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
		},

		pointerlockchange: () => {
			if (this.scene.activeCamera) {
				const locked = (this.window.document.pointerLockElement === this.canvas)
				if (locked) this.scene.activeCamera.attachControl(this.canvas)
				else this.scene.activeCamera.detachControl(this.canvas)
			}
		}
	}

	constructor({engine, scene, window, canvas, physics}: SusaOptions) {
		if (physics) {
			scene.enablePhysics(Vector3.FromArray(physics.gravity), physics.plugin)
		}
		canvas.onclick = () => canvas.requestPointerLock()
		engine.isPointerLock = true

		const fallbackCamera = new Camera("FallbackCamera", new Vector3(0, 1, -15), scene)
		if (!scene.activeCamera) scene.activeCamera = fallbackCamera

		Object.assign(this, {engine, scene, window, canvas, fallbackCamera})
	}

	destructor() {}

	start() {
		this.active = true

		this.window.addEventListener("resize", this.listeners.resize)
		this.window.addEventListener("mousemove", this.listeners.mousemove)
		this.window.document.addEventListener("pointerlockchange", this.listeners.pointerlockchange)

		this.engine.runRenderLoop(() => {
			if (!this.active) return null
			const since = now() - this.lastFrameTime
			this.scene.render()
			this.lastFrameTime = now()
		})
	}

	stop() {
		this.active = false

		this.window.removeEventListener("resize", this.listeners.resize)
		this.window.removeEventListener("mousemove", this.listeners.mousemove)
		this.window.document.removeEventListener("pointerlockchange", this.listeners.pointerlockchange)

		this.engine.stopRenderLoop()
	}
}

export interface SusaOptions {
	scene: Scene
	engine: Engine
	window: Window
	canvas: HTMLCanvasElement
	physics?: {
		gravity: Vector
		plugin: IPhysicsEnginePlugin
	}
}
