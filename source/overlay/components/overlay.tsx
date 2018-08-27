
import {h, Component} from "preact"

import {Stick} from "./stick"
import {OverlayProps} from "./components-interfaces"

export class Overlay extends Component<OverlayProps> {
	render() {
		const {overlayStore} = this.props
		return (
			<div className="overlay">
				<div className="thumbsticks">
					<Stick stickStore={overlayStore.stick1}/>
					<Stick stickStore={overlayStore.stick2}/>
				</div>
			</div>
		)
	}
}
