
import * as nipplejs from "nipplejs"

export interface NippleData {
	angle: {
		radian: number
		degree: number
	}
	direction: {x?: string; y?: string; angle: string}
	force: number
	identifier: number
	instance: any
	position: {x: number; y: number}
	pressure: number
}

export type MoveHandler = (info: ThumbstickInfo) => void

export interface ThumbstickOptions {
	zone: HTMLElement
	onMove?: MoveHandler
}

export interface ThumbstickInfo {
	angle: number
	force: number
}

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
			size: 200,
			color: "white",
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
