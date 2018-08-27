
import * as babylon from "babylonjs"

import {cap} from "../../toolbox"
import {StickStore} from "../../overlay"
import {Thumbstick} from "../tools/thumbstick"
import {RotatableNode} from "../tools/tools-interfaces"
import {TickInfo, EntityPlugin} from "../../interfaces"

import {LookPluginOptions} from "./plugins-interfaces"

class Freelook {
	horizontal: number = 0
	vertical: number = 0

	add(horizontal: number, vertical: number) {
		this.horizontal += horizontal
		this.vertical += vertical
		this.vertical = cap(this.vertical, -(Math.PI / 2), Math.PI / 2)
	}
}

export class LookPlugin implements EntityPlugin {
	private freelook = new Freelook()
	private readonly node: RotatableNode
	private readonly engine: babylon.Engine
	private readonly stickStore: StickStore

	constructor({engine, node, stickStore}: LookPluginOptions) {
		this.node = node
		this.engine = engine
		this.stickStore = stickStore

		for (const eventName of Object.keys(this.eventHandlers)) {
			window.addEventListener(eventName, this.eventHandlers[eventName], false)
		}
	}

	logic(tick: TickInfo) {
		this.ascertainThumblook()
		this.enactLook()
	}

	destructor() {
		const {eventHandlers} = this
		for (const eventName of Object.keys(eventHandlers)) {
			window.removeEventListener(eventName, eventHandlers[eventName])
		}
	}

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

	private ascertainThumblook() {
		const {stickStore, freelook} = this
		const {angle, force} = stickStore
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
}
