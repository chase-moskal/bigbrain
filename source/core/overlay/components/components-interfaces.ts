
import {StickStore} from "../stores/stick-store.js"
import {OverlayStore} from "../stores/overlay-store.js"
import {MenuBarStore} from "../stores/menu-bar-store.js"
import {MainMenuStore} from "../stores/main-menu-store.js"

export interface OverlayProps {
	overlayStore: OverlayStore
}

export interface StickProps {
	stickStore: StickStore
}

export interface MainMenuProps {
	store: MainMenuStore
}

export interface MenuBarProps {
	store: MenuBarStore
}
