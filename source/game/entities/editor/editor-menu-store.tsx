
import {observable} from "mobx"
import {MenuStore} from "../../../overlay/stores/menu-store"

export class EditorMenuStore extends MenuStore {
	@observable label = "Editing"
}
