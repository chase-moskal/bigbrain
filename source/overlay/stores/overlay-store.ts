
import * as preact from "preact"
import {observable} from "mobx"
import {MainMenu} from "../components"

import {StickStore} from "./stick-store"
import {MenuBarStore} from "./menu-bar-store"
import {MainMenuStore} from "./main-menu-store"

export class OverlayStore {
	@observable stick1 = new StickStore()
	@observable stick2 = new StickStore()
	@observable menuBar: MenuBarStore

	constructor() {
		const mainMenuStore = new MainMenuStore()
		this.menuBar = new MenuBarStore()
		this.menuBar.addMenu(mainMenuStore, <typeof preact.Component>MainMenu)

		// start with main menu open
		this.menuBar.setOpen(mainMenuStore, true)
	}
}
