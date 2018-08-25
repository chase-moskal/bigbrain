
import {Entity} from "../../entity"
import {TickInfo, Bearings, EntityPlugin} from "../../interfaces"

import {Context} from "../game-interfaces"
import {LookPlugin} from "../plugins/look-plugin"
import {MovePlugin} from "../plugins/move-plugin"
import {PropPlugin} from "../plugins/prop-plugin"
import {makeBasicCamera} from "../tools/camtools"

export interface EditorEntry {
	type: "Editor"
	bearings: Bearings
}

export class Editor extends Entity<Context, EditorEntry> {
	readonly camera = makeBasicCamera({
		scene: this.context.scene,
		bearings: this.entry.bearings
	})

	private readonly plugins: EntityPlugin[] = [
		new MovePlugin({
			node: this.camera,
			stickZone: this.context.overlay.querySelector(".stick1")
		}),
		new LookPlugin({
			node: this.camera,
			engine: this.context.engine,
			stickZone: this.context.overlay.querySelector(".stick2")
		}),
		new PropPlugin({
			scene: this.context.scene,
			canvas: this.context.canvas,
			manager: this.context.manager
		})
	]

	logic(tick: TickInfo) {
		for (const system of this.plugins) system.logic(tick)
	}

	async destructor() {
		this.camera.dispose()
		for (const system of this.plugins) system.destructor()
	}
}
