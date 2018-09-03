
import {Menu} from "../components"
import {MenuStore} from "./menu-store"

export interface MenuBarItem {
	store: MenuStore
	Component: typeof Menu
	open: boolean
	setOpen: (open?: boolean) => void
}

export interface MenuStoreOptions {
	label?: string
	className?: string
}
