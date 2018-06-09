
import * as nipplejs from "nipplejs"

export interface ThumbstickInfo {
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

export function makeThumbstick({zone, onMove}: {
	zone: HTMLElement
	onMove: (info: ThumbstickInfo) => void
}): {
	manager: any
} {
	const manager = nipplejs.create({
		zone,
		size: 200,
		color: "white",
		mode: "static",
		position: {bottom: "50%", left: "50%"}
	})
	manager.on("start end", (event, instance) => {
		onMove({
			angle: {radian: 0, degree: 0},
			direction: {x: "", y: "", angle: ""},
			force: 0,
			identifier: 0,
			instance,
			position: {x: 0, y: 0},
			pressure: 0
		})
	})
	manager.on("move", (event, info: ThumbstickInfo) => onMove(info))
	return {manager}
}
