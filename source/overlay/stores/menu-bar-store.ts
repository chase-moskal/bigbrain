
import * as preact from "preact"
import {observable, action} from "mobx"

import {MenuStore} from "./menu-store"
import {MenuBarItem} from "./stores-interfaces"

export class MenuBarStore {
	@observable menus: MenuBarItem[] = []

	@action addMenu(store: MenuStore, Component: typeof preact.Component): void {
		this.menus.push({
			store,
			Component,
			open: false,
			setOpen: (open: boolean) => this.setOpen(store, open)
		})
	}

	@action removeMenu(obsolete: MenuStore): void {
		this.menus = this.menus.filter(({store}) => store !== obsolete)
	}

	@action setOpen(store: MenuStore, open?: boolean) {
		const menu = this.menus.find(m => m.store === store)
		const lastOpen = menu.open
		for (const menu of this.menus) menu.open = false
		menu.open = (open === undefined || open === null)
			? !lastOpen
			: open
	}
}
