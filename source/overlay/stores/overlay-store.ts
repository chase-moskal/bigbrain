
import {observable} from "mobx"

import {StickStore} from "./stick-store"
import {MenuBarStore} from "./menu-bar-store"
import {MainMenuStore} from "./main-menu-store"
import {MainMenu} from "../components"

export class OverlayStore {
	@observable stick1 = new StickStore()
	@observable stick2 = new StickStore()
	@observable menuBar: MenuBarStore

	constructor() {
		this.menuBar = new MenuBarStore()
		this.menuBar.addMenu(new MainMenuStore(), MainMenu)
	}
}
