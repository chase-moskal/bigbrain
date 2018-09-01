
import {observable} from "mobx"
import {MenuStore} from "./menu-store"

export class MainMenuStore extends MenuStore {
	@observable label = "Main Menu"
}
