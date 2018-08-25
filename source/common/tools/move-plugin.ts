
import {TickInfo} from "../../ticker"
import {Watcher} from "../../watcher"
import {EntityPlugin} from "../../entity"

import {Thumbstick} from "./thumbstick"
import {traversiveBindings, ascertainMovement, enactMovement, MovableNode} from "./traversal"

export interface MovePluginOptions {
	node: MovableNode
	stickZone: HTMLElement
}

export class MovePlugin implements EntityPlugin {
	private readonly node: MovableNode
	private readonly thumbstick: Thumbstick
	private readonly watcher = new Watcher<typeof traversiveBindings>({
		bindings: traversiveBindings
	})

	constructor({node, stickZone}: MovePluginOptions) {
		this.node = node
		this.thumbstick = new Thumbstick({zone: stickZone})
	}

	logic(tick: TickInfo) {
		const {node, thumbstick, watcher} = this
		enactMovement({
			node,
			move: ascertainMovement({
				watcher,
				stickInfo: thumbstick.info,
				timeFactor: tick.timeSinceLastTick / 50
			})
		})
	}

	destructor() {
		this.watcher.destructor()
	}
}
