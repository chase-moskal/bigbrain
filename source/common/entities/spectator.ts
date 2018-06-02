
import * as deepFreeze from "deep-freeze"
import {Scene, FreeCamera, Vector3} from "babylonjs"
import {observable, computed, reaction, autorun} from "mobx"

import {Context} from "../../game"
import {Entity} from "../../entity"
import {Ticker, Tick} from "../../ticker"
import {loadBabylonFile} from "../../toolbox"
import {Watcher, Input, Bindings, Status} from "../../watcher"
import {Vector, Bearings, StateEntry, Message} from "../../interfaces"
import {makeCamera, applyLogicalMovement, traversiveBindings} from "../tools/camtools"

export interface SpectatorEntry extends StateEntry {
	type: "Spectator"
	bearings: Bearings
}

export class Spectator extends Entity<Context, SpectatorEntry> {
	protected readonly context: Context
	private readonly camera: FreeCamera = makeCamera({
		scene: this.context.scene,
		bearings: this.entry.bearings,
		speed: 0.1
	})
	private readonly watcher = new Watcher<typeof traversiveBindings>({eventTarget: this.context.window, bindings: traversiveBindings})
	private readonly ticker: Ticker = (() => {
		const {camera, watcher} = this
		const ticker = new Ticker({action: tick => applyLogicalMovement({tick, camera, watcher})})
		ticker.start()
		return ticker
	})()

	async destructor() {
		this.ticker.destructor()
	}
}
