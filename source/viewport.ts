
import * as babylon from "babylonjs"

import {getTime} from "./toolbox/get-time"
import {ViewportOptions} from "./interfaces"
import {Service} from "./toolbox/toolbox-interfaces"

/**
 * Scene rendering and input manager
 *  - manage the babylon rendering loop (start/stop methods)
 *  - html dom event handling for pointer locking
 */
export class Viewport implements Service {
	private readonly scene: babylon.Scene
	private readonly engine: babylon.Engine
	private readonly window: Window
	private readonly canvas: HTMLCanvasElement

	private active: boolean = false
	private readonly fallbackCamera: babylon.Camera
	private pick: babylon.PickingInfo = new babylon.PickingInfo()
	private lastFrameTime = getTime()
	private locked: boolean = false

	renderRate: number = 0

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

	constructor({engine, scene, window, canvas, start = true}: ViewportOptions) {
		canvas.onclick = () => canvas.requestPointerLock()

		const fallbackCamera = new babylon.Camera("viewport.fallback.camera", new babylon.Vector3(0, 1, -15), scene)
		if (!scene.activeCamera) scene.activeCamera = fallbackCamera

		Object.assign(this, {engine, scene, window, canvas, fallbackCamera})

		if (start) this.start()
	}

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
			this.renderRate = engine.getFps()
		})
	}

	stop() {
		const {window, listeners, engine} = this
		this.active = false
		this.renderRate = 0

		window.removeEventListener("resize", listeners.resize)
		window.removeEventListener("mousemove", listeners.mousemove)
		window.document.removeEventListener("pointerlockchange", listeners.pointerlockchange)

		engine.stopRenderLoop()
	}

	destructor() {}
}
