
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {EditorMenuProps} from "./editor-interfaces"

@observer
export class EditorMenu extends Component<EditorMenuProps> {

	private renderToolbar() {
		const {store} = this.props
		return (
			<div class="tools">
				<p>Tools</p>
				{store.tools.map(tool =>
					<button
						className="tool"
						title={tool.tooltip}
						onClick={this.handleToolClick}
						data-active={store.activeTool === tool ? "true" : "false"}>
							{tool.label}
					</button>
				)}
			</div>
		)
	}

	private handleToolClick = (event: MouseEvent) => {
		const {store} = this.props
		const label = event.srcElement.textContent.trim()
		const tool = store.tools.find(
			t => t.label.toLowerCase() === label.toLowerCase()
		)
		store.setActiveTool(tool)
		event.preventDefault()
		return false
	}

	render() {
		return (
			<div class="editor-menu">
				{this.renderToolbar()}
			</div>
		)
	}
}
