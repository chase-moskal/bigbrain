
import {observer} from "mobx-preact"
import {h, Component, ComponentChildren} from "preact"
import {MenuProps} from "./components-interfaces"

@observer
export class Menu extends Component<MenuProps> {

	render() {
		const {store} = this.props
		return (
			<div>
				menu
			</div>
		)
	}
}
