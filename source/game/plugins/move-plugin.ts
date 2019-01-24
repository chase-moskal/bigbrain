
import {Watcher} from "../../core/watcher/watcher"
import {MovableNode} from "../tools/tools-interfaces"
import {TickInfo, EntityPlugin} from "../../core/interfaces"
import {StickStore} from "../../core/overlay/stores/stick-store"
import {
	enactMovement,
	ascertainMovement,
	traversiveBindings
} from "../tools/traversal"

import {MovePluginOptions} from "./plugins-interfaces"

export class MovePlugin implements EntityPlugin {
	private readonly node: MovableNode
	private readonly stickStore: StickStore
	private readonly watcher = new Watcher<typeof traversiveBindings>({
		bindings: traversiveBindings
	})

	constructor({node, stickStore}: MovePluginOptions) {
		this.node = node
		this.stickStore = stickStore
	}

	logic(tick: TickInfo) {
		const {node, stickStore, watcher} = this
		const {angle, force} = stickStore
		enactMovement({
			node,
			move: ascertainMovement({
				watcher,
				stickInfo: {angle, force},
				timeFactor: tick.timeSinceLastTick / 50
			})
		})
	}

	destructor() {
		this.watcher.destructor()
	}
}
