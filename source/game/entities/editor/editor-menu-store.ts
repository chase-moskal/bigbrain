
import {observable, action} from "mobx"
import {MenuStore} from "../../../overlay/stores/menu-store"
import {EditorTool} from "./editor-interfaces"

export class AddTool implements EditorTool {
	label = "Add"
	tooltip = "Add tool, insert props into the world"
}

export class RemoveTool implements EditorTool {
	label = "Remove"
	tooltip = "Remove tool, extricate props from the world"
}

export class EditorMenuStore extends MenuStore {
	@observable label = "Editing"
	@observable activeTool: EditorTool = null

	@observable tools: EditorTool[] = [
		new AddTool(),
		new RemoveTool()
	]

	@action setActiveTool(tool: EditorTool) {
		this.activeTool = tool
	}
}
