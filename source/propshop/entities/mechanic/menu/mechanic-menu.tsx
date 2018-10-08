
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {SceneManager} from "./scene-manager"
import {MechanicMenuProps} from "./mechanic-menu-interfaces"

@observer
export class MechanicMenu extends Component<MechanicMenuProps> {

	render() {
		const {store} = this.props
		return (
			<div className="mechanic-menu">
				<SceneManager store={store.sceneManager}/>
			</div>
		)
	}
}
