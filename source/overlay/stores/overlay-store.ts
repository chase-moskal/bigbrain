
import {observable} from "mobx"

import {StickStore} from "./stick-store"
import {MenuBarStore} from "./menu-bar-store"
import {MainMenuStore} from "./main-menu-store"
import {ContextMenuStore} from "./context-menu-store"

export class OverlayStore {
	@observable stick1 = new StickStore()
	@observable stick2 = new StickStore()
	@observable menuBar = new MenuBarStore({
		menuStores: [
			new MainMenuStore(),
			new ContextMenuStore()
		]
	})
}
