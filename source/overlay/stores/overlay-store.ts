
import {observable} from "mobx"
import * as preact from "preact"
import {MainMenu} from "../components/main-menu"

import {StickStore} from "./stick-store"
import {MenuBarStore} from "./menu-bar-store"
import {MainMenuStore} from "./main-menu-store"
import {StatisticsStore} from "./statistics-store"

export class OverlayStore {
	readonly mainMenuStore: MainMenuStore

	@observable stick1 = new StickStore()
	@observable stick2 = new StickStore()
	@observable menuBar: MenuBarStore

	constructor({statisticsStore}: {statisticsStore: StatisticsStore}) {
		const mainMenuStore = this.mainMenuStore = new MainMenuStore({
			statisticsStore
		})
		const menuBar = this.menuBar = new MenuBarStore()
		menuBar.addMenu(mainMenuStore, <typeof preact.Component>MainMenu)
	}
}
