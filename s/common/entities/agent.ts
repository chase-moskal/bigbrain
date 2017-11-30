
import {reaction} from "mobx"
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import {Context} from "../game"
import {Entity} from "../../monarch"
import Watcher, {Input} from "../../watcher"
import {makeActiveCamera, createRoundCameraRig} from "../tools/camtools"

import Editor from "./editor"

export interface AgentEntry {
	type: "Agent"
	player: boolean
	position: [number, number, number]
}

export default class Agent extends Entity<Context, AgentEntry> {

	private readonly watcher = new Watcher({
		eventTarget: this.context.window,
		bindings: {
			suicide: [Input.R]
		}
	})

	private tank = Mesh.CreateBox(`agent-${Date.now()}`, 1, this.context.scene, true)

	private readonly camera = createRoundCameraRig({
		scene: this.context.scene,
		canvas: this.context.canvas,
		targetPosition: [0, 0, 0],
		radius: 4,
		active: true
	})

	private readonly reactions = [
		reaction(() => this.watcher.status.suicide, suicide => {
			if (suicide) {
				console.log("agent suicide", this.id)
				this.context.manager.removeEntry(this.id)
			}
		})
	]

	private readonly greeting = (() => {
		console.log("agent spawn", this.id)
		return true
	})()

	readonly player = this.entry.player

	destructor() {
		for (const dispose of this.reactions) dispose()

		const editor = <Editor>this.context.manager.getEntities().find(entity => entity instanceof Editor)
		this.context.scene.activeCamera = editor.camera

		this.camera.dispose()
		this.tank.dispose()
	}
}
