
import {observable, action} from "mobx"

import {MenuStore} from "./menu-store"
import {StatisticsStore} from "./statistics-store"

export class MainMenuStore extends MenuStore {
	@observable label = "Menu"
	@observable lookSensitivity: number = 50
	@observable statisticsStore: StatisticsStore

	constructor({statisticsStore}: {statisticsStore: StatisticsStore}) {
		super()
		this.statisticsStore = statisticsStore
	}

	@action setLookSensitivity(value: number) {
		this.lookSensitivity = value
	}
}
