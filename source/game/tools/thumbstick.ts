
import * as nipplejs from "nipplejs"

import {
	NippleData,
	ThumbstickInfo,
	ThumbstickOptions
} from "./tools-interfaces"

const defaultThumbstickInfo: ThumbstickInfo = {angle: 0, force: 0}

export class Thumbstick {
	info: ThumbstickInfo = defaultThumbstickInfo

	constructor({zone, onMove = () => {}}: ThumbstickOptions) {
		const move = (info: ThumbstickInfo) => {
			this.info = info
			onMove(info)
		}

		const manager = nipplejs.create({
			zone,
			size: 120,
			color: "rgba(255,255,255, 0.5)",
			mode: "static",
			position: {bottom: "50%", left: "50%"}
		})

		manager.on("start end", (event, instance) => move(defaultThumbstickInfo))

		manager.on("move", (event, data: NippleData) => move({
			angle: data.angle.radian,
			force: data.force
		}))
	}
}
