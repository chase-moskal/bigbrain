
import {Scene, Engine, PickingInfo, Camera, Vector3, SceneLoader} from "babylonjs"

import Physics from "./physics"
import {now, Service} from "./toolbox"

export interface SusaOptions {
	scene: Scene
	engine: Engine
	physics: Physics
	window: Window
	canvas: HTMLCanvasElement
}

export function pathBreakdown(path: string) {
	let dirpath = ""
	let filename = ""
	if (path.includes("/")) {
		const parts = path.split("/")
		filename = parts.pop()
		dirpath = parts.join("/") + "/"
	} else {
		filename = path
	}
	return {dirpath, filename}
}

export async function loadBabylonFile(scene, path: string, onProgress: (event: ProgressEvent) => void = event => {}) {
	SceneLoader.ShowLoadingScreen = false
	const {dirpath, filename} = pathBreakdown(path)
	return new Promise((resolve, reject) => {
		SceneLoader.Append(
			dirpath,
			filename,
			scene,
			() => resolve(),
			onProgress,
			() => reject(new Error(`Error loading babylon file: "${path}"`))
		)
	})
}

/**
 * Game world
 */
export default class Susa implements Service {
	private readonly scene: Scene
	private readonly engine: Engine
	private readonly physics: Physics
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

	constructor(options: SusaOptions) {
		this.engine = options.engine
		this.scene = options.scene
		this.physics = options.physics
		this.window = options.window
		this.canvas = options.canvas

		this.canvas.onclick = () => this.canvas.requestPointerLock()
		this.engine.isPointerLock = true

		this.fallbackCamera = new Camera("FallbackCamera", new Vector3(0, 1, -15), this.scene)
		if (!this.scene.activeCamera) this.scene.activeCamera = this.fallbackCamera
	}

	destructor() {
		this.physics.destructor()
	}

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

		this.physics.start()
	}

	stop() {
		this.active = false

		this.window.removeEventListener("resize", this.listeners.resize)
		this.window.removeEventListener("mousemove", this.listeners.mousemove)
		this.window.document.removeEventListener("pointerlockchange", this.listeners.pointerlockchange)

		this.engine.stopRenderLoop()
		this.physics.stop()
	}
}
