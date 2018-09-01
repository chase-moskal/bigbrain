
import {Menu} from "./menu"
import {StickStore} from "../stores"
import {MenuStore} from "../stores/menu-store"
import {OverlayStore} from "../stores/overlay-store"
import {MenuBarStore} from "../stores/menu-bar-store"

export interface OverlayProps {
	overlayStore: OverlayStore
}

export interface StickProps {
	stickStore: StickStore
}

export interface MenuProps {
	store: MenuStore
}

export interface MenuComponentStoreRelation {
	Store: typeof MenuStore
	Component: typeof Menu
}

export interface MenuBarProps {
	store: MenuBarStore
	relations?: MenuComponentStoreRelation[]
}
