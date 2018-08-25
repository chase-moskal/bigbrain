
import {Watcher} from "../../watcher"
import {TickInfo, EntityPlugin} from "../../interfaces"

import {Thumbstick} from "../tools/thumbstick"
import {traversiveBindings, ascertainMovement, enactMovement, MovableNode} from "../tools/traversal"

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
