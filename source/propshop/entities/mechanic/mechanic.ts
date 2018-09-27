
import * as preact from "preact"

import {Entity} from "../../../entity"
import {Context} from "../../../game/game-interfaces"

import {MechanicMenu} from "./mechanic-menu"
import {MechanicEntry} from "./mechanic-interfaces"
import {MechanicMenuStore} from "./mechanic-menu-store"

export class Mechanic extends Entity<Context, MechanicEntry> {

	private menu = new MechanicMenuStore({scene: this.context.scene})

	async init() {
		this.context.overlayStore.menuBar.addMenu(
			this.menu,
			<typeof preact.Component>MechanicMenu
		)
	}

	async destructor() {
		this.context.overlayStore.menuBar.removeMenu(this.menu)
	}
}
