
import * as babylon from "babylonjs"

import {cap} from "../../toolbox"
import {Ticker} from "../../ticker"
import {Thumbstick} from "../tools/thumbstick"
import {RotatableNode} from "../tools/traversal"

export interface LookSystemOptions {
	engine: babylon.Engine
	node: RotatableNode
	stickZone: HTMLElement
}

class Freelook {
	horizontal: number = 0
	vertical: number = 0

	add(horizontal: number, vertical: number) {
		this.horizontal += horizontal
		this.vertical += vertical
		this.vertical = cap(this.vertical, -(Math.PI / 2), Math.PI / 2)
	}
}

export class LookSystem {
	private readonly engine: babylon.Engine
	private readonly node: RotatableNode
	private readonly thumbstick: Thumbstick
	private readonly ticker: Ticker

	constructor({engine, node, stickZone}: LookSystemOptions) {
		this.engine = engine
		this.node = node
		this.thumbstick = new Thumbstick({zone: stickZone})

		for (const eventName of Object.keys(this.eventHandlers)) {
			window.addEventListener(eventName, this.eventHandlers[eventName], false)
		}

		const ticker = new Ticker({action: tick => {
			this.ascertainThumbLook()
			this.enactLook()
		}})

		ticker.start()

		this.ticker = ticker
	}

	private freelook = new Freelook()

	private eventHandlers = {
		mousemove: (event: MouseEvent) => {
			const {movementX, movementY} = event
			if (this.engine.isPointerLock && !isNaN(movementX) && !isNaN(movementY)) {
				const sensitivity = 2000
				const {freelook} = this
				freelook.add(movementX / sensitivity, movementY / sensitivity)
			}
		}
	}

	private ascertainThumbLook() {
		const {thumbstick, freelook} = this
		const {angle, force} = thumbstick.info
		if (force > 0) {
			const x = Math.cos(angle)
			const y = -Math.sin(angle)
			const factor = force / 25
			freelook.add(x * factor, y * factor)
		}
	}

	private enactLook() {
		const {freelook, node} = this
		if (!freelook) return
		const {horizontal, vertical} = freelook
		const quaternion = babylon.Quaternion.RotationYawPitchRoll(horizontal, vertical, 0)
		node.rotationQuaternion = quaternion
	}

	destructor() {
		for (const eventName of Object.keys(this.eventHandlers)) {
			window.removeEventListener(eventName, this.eventHandlers[eventName])
		}
		this.ticker.destructor()
	}
}
