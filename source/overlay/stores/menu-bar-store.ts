
import {observable, action} from "mobx"

import {MenuStore} from "./menu-store"
import {MenuBarStoreOptions, MenuBarItem} from "./stores-interfaces"

export class MenuBarStore {
	@observable menus: MenuBarItem[] = []

	constructor({menuStores}: MenuBarStoreOptions) {
		for (const store of menuStores) this.addMenu(store)
	}

	@action addMenu(store: MenuStore): void {
		this.menus.push({
			store,
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
