
import {StickStore} from "../stores/stick-store"
import {OverlayStore} from "../stores/overlay-store"
import {MenuBarStore} from "../stores/menu-bar-store"
import {MainMenuStore} from "../stores/main-menu-store"

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
