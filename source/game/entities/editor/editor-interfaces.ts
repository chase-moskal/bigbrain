
import {Bearings} from "../../../interfaces"
import {EditorMenuStore} from "./editor-menu-store"

export interface EditorEntry {
	type: "Editor"
	bearings: Bearings
}

export interface EditorMenuProps {
	store: EditorMenuStore
}
