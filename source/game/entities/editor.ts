
import {Entity} from "../../entity"
import {TickInfo, Bearings, EntityPlugin} from "../../interfaces"

import {Context} from "../game-interfaces"
import {LookPlugin} from "../plugins/look-plugin"
import {MovePlugin} from "../plugins/move-plugin"
import {PropPlugin} from "../plugins/prop-plugin"
import {makeBasicCamera} from "../tools/camtools"

import {ContextMenuStore} from "../../overlay/stores/context-menu-store"

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
			stickStore: this.context.overlayStore.stick1
		}),
		new LookPlugin({
			node: this.camera,
			engine: this.context.engine,
			stickStore: this.context.overlayStore.stick2
		}),
		new PropPlugin({
			scene: this.context.scene,
			canvas: this.context.canvas,
			manager: this.context.manager
		})
	]

	private readonly menu = new ContextMenuStore()

	async init() {
		const {menuBar} = this.context.overlayStore
		menuBar.addMenu(this.menu)
	}

	logic(tick: TickInfo) {
		for (const system of this.plugins) system.logic(tick)
	}

	async destructor() {
		const {menuBar} = this.context.overlayStore
		menuBar.removeMenu(this.menu)
		this.camera.dispose()
		for (const system of this.plugins) system.destructor()
	}
}
