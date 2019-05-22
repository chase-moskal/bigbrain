
import * as nipplejs from "nipplejs"

import {
	NippleData,
	ThumbstickInfo,
	ThumbstickOptions
} from "./tools-interfaces.js"

const defaultThumbstickInfo: ThumbstickInfo = {angle: 0, force: 0}

export class Thumbstick {
	info: ThumbstickInfo = {...defaultThumbstickInfo}
	private manager: any

	constructor({zone, onMove = () => {}}: ThumbstickOptions) {
		const move = (info: ThumbstickInfo) => {
			this.info = info
			onMove(info)
		}

		const manager = this.manager = nipplejs.create({
			zone,
			size: 120,
			color: "rgba(255,255,255, 0.5)",
			mode: "static",
			position: {bottom: "50%", left: "50%"}
		})

		// TODO "start end"?
		manager.on("start", (event, instance) => move(defaultThumbstickInfo))

		manager.on("move", (event, data: NippleData) => move({
			angle: data.angle.radian,
			force: data.force
		}))
	}

	destructor() {
		this.manager.destroy()
		this.manager = null
	}
}
