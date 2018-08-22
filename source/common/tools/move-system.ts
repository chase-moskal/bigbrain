
import {Ticker} from "../../ticker"
import {Watcher} from "../../watcher"
import {Thumbstick} from "../tools/thumbstick"
import {traversiveBindings, ascertainMovement, enactMovement, MovableNode} from "../tools/traversal"

export interface MoveSystemOptions {
	node: MovableNode
	stickZone: HTMLElement
}

export class MoveSystem {
	private readonly watcher = new Watcher<typeof traversiveBindings>({
		bindings: traversiveBindings
	})

	private readonly ticker: Ticker

	constructor({node, stickZone}: MoveSystemOptions) {
		const thumbstick = new Thumbstick({zone: stickZone})
		const {watcher} = this

		const ticker = this.ticker = new Ticker({tickAction: tick => {
			enactMovement({
				node,
				move: ascertainMovement({
					watcher,
					stickInfo: thumbstick.info,
					timeFactor: tick.timeSinceLastTick / 50
				})
			})
		}})

		ticker.start()
	}

	destructor() {
		this.watcher.destructor()
		this.ticker.destructor()
	}
}
