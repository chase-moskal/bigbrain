
import {observable, action} from "mobx"

import {MenuStore} from "./menu-store.js"
import {StatisticsStore} from "./statistics-store.js"

const storageKeyLookSensitivity = "monarch-look-sensitivity"

const getStorageLookSensitivity = (): number => {
	const value = localStorage.getItem(storageKeyLookSensitivity)
	return value ? JSON.parse(value) : 50
}

const saveStorageLookSensitivity = (value: number): void => {
	localStorage.setItem(storageKeyLookSensitivity, JSON.stringify(value))
}

export class MainMenuStore extends MenuStore {
	@observable label = "Menu"
	@observable lookSensitivity: number = getStorageLookSensitivity()
	@observable statisticsStore: StatisticsStore

	constructor({statisticsStore}: {statisticsStore: StatisticsStore}) {
		super()
		this.statisticsStore = statisticsStore
	}

	@action setLookSensitivity(value: number) {
		this.lookSensitivity = value
		saveStorageLookSensitivity(value)
	}
}
