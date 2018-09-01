
import {MenuStore} from "./menu-store"

export interface MenuBarItem {
	store: MenuStore
	open: boolean
	setOpen: (open?: boolean) => void
}

export interface MenuBarStoreOptions {
	menuStores: MenuStore[]
}

export interface MenuStoreOptions {
	label?: string
	className?: string
}
