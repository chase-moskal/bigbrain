
import {autorun, reaction} from "mobx"

import {Entity} from "../../entity"
import {GameContext} from "../game"
import {Manager} from "../../manager"
import {StateEntry, VectorZero, QuaternionZero} from "../../interfaces"
import {Watcher, Input, Bindings} from "../../watcher"

import {Agent, AgentEntry} from "./agent"

export interface DirectorEntry extends StateEntry {
	type: "Director"
}

const bindings = {
	spawnPlayer: [Input.R],
	spawnNpc: [Input.F]
}

export class Director extends Entity<GameContext, DirectorEntry> {

	private readonly watcher = new Watcher<typeof bindings>({
		eventTarget: this.context.window,
		bindings
	})

	private npcs = []

	private spawnPlayer(manager: Manager) {
		manager.addEntry(<AgentEntry>{
			type: "Agent",
			player: true,
			bearings: {
				position: VectorZero,
				rotation: QuaternionZero
			}
		})
	}

	private readonly reactions = [
		autorun(() => {
			const spawnPlayer = this.watcher.status.spawnPlayer
			if (spawnPlayer) {
				const {manager} = this.context

				const players = <Agent[]>manager.getEntities()
					.filter(entity => entity instanceof Agent && entity.player)

				if (players.length === 0) this.spawnPlayer(manager)
			}
		}),
		autorun(() => {
			const spawnNpc = this.watcher.status.spawnNpc
			if (spawnNpc) {
				console.log("TODO spawn NPC at origin")
			}
		})
	]

	async destructor() {
		for (const dispose of this.reactions) dispose()
	}
}
