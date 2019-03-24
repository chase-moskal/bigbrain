
import * as preact from "preact"
import {observable, action, computed} from "mobx"

import {MainMenu} from "../components/main-menu.js"

import {StickStore} from "./stick-store.js"
import {MenuBarStore} from "./menu-bar-store.js"
import {MainMenuStore} from "./main-menu-store.js"
import {StatisticsStore} from "./statistics-store.js"

export class OverlayStore {
	readonly menuBar: MenuBarStore
	readonly mainMenuStore: MainMenuStore
	readonly stick1 = new StickStore()
	readonly stick2 = new StickStore()

	@observable private stickSubscribers: number = 0

	@computed get sticksEngaged(): boolean {
		return (this.stickSubscribers > 0)
	}

	constructor({statisticsStore}: {statisticsStore: StatisticsStore}) {
		const mainMenuStore = this.mainMenuStore = new MainMenuStore({
			statisticsStore
		})
		const menuBar = this.menuBar = new MenuBarStore()
		menuBar.addMenu(mainMenuStore, <typeof preact.Component>MainMenu)
	}

	@action addStickSubscriber() {
		this.stickSubscribers += 1
	}

	@action subtractStickSubscriber() {
		this.stickSubscribers -= 1
	}
}
