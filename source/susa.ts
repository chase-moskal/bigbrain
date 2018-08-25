
import * as babylon from "babylonjs"

import {SusaOptions} from "./interfaces"
import {getTime, Service} from "./toolbox"

/**
 * Susa rendering and input manager
 *  - manage the babylon rendering loop (start/stop methods)
 *  - html dom event handling for pointer locking
 */
export class Susa implements Service {
	private readonly scene: babylon.Scene
	private readonly engine: babylon.Engine
	private readonly window: Window
	private readonly canvas: HTMLCanvasElement

	private active: boolean = false
	private readonly fallbackCamera: babylon.Camera
	private pick: babylon.PickingInfo = new babylon.PickingInfo()
	private lastFrameTime = getTime()
	private locked: boolean = false

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
				this.locked = locked
			}
		}
	}

	constructor({engine, scene, window, canvas}: SusaOptions) {
		canvas.onclick = () => canvas.requestPointerLock()

		const fallbackCamera = new babylon.Camera("susa.fallback.camera", new babylon.Vector3(0, 1, -15), scene)
		if (!scene.activeCamera) scene.activeCamera = fallbackCamera

		Object.assign(this, {engine, scene, window, canvas, fallbackCamera})
	}

	destructor() {}

	start() {
		const {window, listeners, engine, scene} = this
		this.active = true

		window.addEventListener("resize", listeners.resize)
		window.addEventListener("mousemove", listeners.mousemove)
		window.document.addEventListener("pointerlockchange", listeners.pointerlockchange)

		engine.runRenderLoop(() => {
			if (!this.active) return null
			const since = getTime() - this.lastFrameTime
			scene.render()
			this.lastFrameTime = getTime()
		})
	}

	stop() {
		const {window, listeners, engine} = this
		this.active = false

		window.removeEventListener("resize", listeners.resize)
		window.removeEventListener("mousemove", listeners.mousemove)
		window.document.removeEventListener("pointerlockchange", listeners.pointerlockchange)

		engine.stopRenderLoop()
	}
}
