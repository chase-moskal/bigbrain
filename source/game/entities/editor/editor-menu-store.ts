
import {observable, action} from "mobx"
import {MenuStore} from "../../../overlay/stores/menu-store"
import {EditorTool} from "./editor-interfaces"

export class AdditionTool implements EditorTool {
	label = "Add"
	tooltip = "Addition tool, insert props into the world"
}

export class SelectionTool implements EditorTool {
	label = "Select"
	tooltip = "Selection tool, edit or remove props"
}

export class EditorMenuStore extends MenuStore {
	@observable label = "Editing"
	@observable activeTool: EditorTool = null

	@observable tools: EditorTool[] = [
		new AdditionTool(),
		new SelectionTool()
	]

	@action setActiveTool(tool: EditorTool) {
		this.activeTool = tool
	}
}
