
import {Context} from "../../game"
import {Entity} from "../../entity"
import {TickInfo} from "../../ticker"
import {Bearings} from "../../interfaces"
import {EntityPlugin} from "../../entity"

import {LookSystem} from "../tools/look-system"
import {MoveSystem} from "../tools/move-system"
import {PropSystem} from "../tools/prop-system"
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
		new MoveSystem({
			node: this.camera,
			stickZone: this.context.overlay.querySelector(".stick1")
		}),
		new LookSystem({
			engine: this.context.engine,
			node: this.camera,
			stickZone: this.context.overlay.querySelector(".stick2")
		}),
		new PropSystem({
			manager: this.context.manager,
			scene: this.context.scene,
			canvas: this.context.canvas
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
