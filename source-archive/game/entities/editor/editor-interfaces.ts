
import {Bearings} from "../../../core/interfaces.js"
import {EditorMenuStore} from "./editor-menu-store.js"

export interface EditorEntry {
	type: "Editor"
	bearings: Bearings
}

export interface EditorMenuProps {
	store: EditorMenuStore
}

export interface EditorTool {
	label: string
	tooltip: string
}
