
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {Stick} from "./stick.js"
import {MenuBar} from "./menu-bar.js"
import {OverlayProps} from "./components-interfaces.js"

@observer
export class Overlay extends Component<OverlayProps> {
	render() {
		const {overlayStore} = this.props
		return (
			<div className="overlay">
				<MenuBar store={overlayStore.menuBar}/>
				{overlayStore.sticksEngaged
					? (
						<div className="thumbsticks">
							<Stick stickStore={overlayStore.stick1}/>
							<Stick stickStore={overlayStore.stick2}/>
						</div>
					)
					: null}
			</div>
		)
	}
}
