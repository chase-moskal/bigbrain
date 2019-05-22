
import * as babylon from "@babylonjs/core"

import {cap} from "../../core/toolbox/cap.js"
import {RotatableNode} from "../tools/tools-interfaces.js"
import {TickInfo, EntityPlugin} from "../../core/interfaces.js"
import {StickStore} from "../../core/overlay/stores/stick-store.js"
import {MainMenuStore} from "../../core/overlay/stores/main-menu-store.js"

import {LookPluginOptions} from "./plugins-interfaces.js"

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
	private readonly freelook = new Freelook()
	private readonly node: RotatableNode
	private readonly engine: babylon.Engine
	private readonly stickStore: StickStore
	private readonly mainMenuStore: MainMenuStore

	constructor({engine, node, stickStore, mainMenuStore}: LookPluginOptions) {
		this.node = node
		this.engine = engine
		this.stickStore = stickStore
		this.mainMenuStore = mainMenuStore

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

	private getSensitivity() {
		return this.mainMenuStore.lookSensitivity / 10000
	}

	private eventHandlers = {
		mousemove: (event: MouseEvent) => {
			const {movementX, movementY} = event
			if (this.engine.isPointerLock && !isNaN(movementX) && !isNaN(movementY)) {
				const {freelook} = this
				const sensitivity = this.getSensitivity()
				freelook.add(movementX * sensitivity, movementY * sensitivity)
			}
		}
	}

	private ascertainThumblook() {
		const {stickStore, freelook} = this
		const {angle, force} = stickStore
		if (force > 0) {
			const x = Math.cos(angle)
			const y = -Math.sin(angle)
			const factor = force * (this.getSensitivity() * 10)
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
