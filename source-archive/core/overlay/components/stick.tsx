
import {h, Component} from "preact"
import {observer} from "mobx-preact"
import {StickProps} from "./components-interfaces.js"
import {Thumbstick} from "../../../game/tools/thumbstick.js"

@observer
export class Stick extends Component<StickProps> {
	thumbstick: Thumbstick

	componentDidMount() {
		this.thumbstick = new Thumbstick({
			zone: this.base,
			onMove: info => {
				const {stickStore} = this.props
				stickStore.setInfo(info)
			}
		})
	}

	componentWillUnmount() {
		this.thumbstick.destructor()
		this.thumbstick = null
	}

	render() {
		const {stickStore} = this.props
		return <div
			className="stick"
			style={{
				display: stickStore.active ? "block" : "none"
			}}>
		</div>
	}
}
