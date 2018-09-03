
import {observable, action} from "mobx"
import {MenuStore} from "./menu-store"

export class MainMenuStore extends MenuStore {
	@observable label = "Menu"
	@observable lookSensitivity: number = 50

	@action setLookSensitivity(value: number) {
		this.lookSensitivity = value
	}
}
