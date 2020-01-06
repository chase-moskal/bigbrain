
import * as babylon from "@babylonjs/core"

export function createViewport() {
	const state = {
		pick: null,
		locked: false,
		renderFrameRate: 0,
	}

	const canvas = document.createElement("canvas")
	
	const engine = new babylon.Engine(canvas, true, {
		stencil: true,
		preserveDrawingBuffer: true,
	})

	const scene = new babylon.Scene(engine)

	const fallbackCamera = new babylon.Camera(
		"viewport.fallback.camera",
		new babylon.Vector3(0, 1, -15),
		scene
	)

	scene.activeCamera = fallbackCamera

	window.addEventListener("resize", () => {
		engine.resize()
	})

	window.addEventListener("mousemove", () => {
		state.pick = scene.pick(scene.pointerX, scene.pointerY)
	})

	document.addEventListener("pointerlockchange", () => {
		if (scene.activeCamera) {
			state.locked = (document.pointerLockElement === canvas)
		}
	})

	engine.runRenderLoop(() => {
		scene.render()
		state.renderFrameRate = engine.getFps()
	})

	return {
		scene,
		engine,
		canvas,
	}
}
