
import {observable} from "mobx"
import {MenuStore} from "./menu-store"

export class ContextMenuStore extends MenuStore {
	@observable label = "Context Menu"
}
