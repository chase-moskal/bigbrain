
import {reaction} from "mobx"

import {Context} from "../game"
import {StateEntry, Entity} from "../../monarch"
import Watcher, {Input, Bindings} from "../../watcher"

import Agent, {AgentEntry} from "./agent"

export interface DirectorEntry extends StateEntry {
  type: "Director"
}

export default class Director extends Entity<Context, DirectorEntry> {

  private readonly watcher = new Watcher<Bindings, {
    spawnPlayer: boolean
    spawnNpc: boolean
  }>({
    eventTarget: this.context.window,
    bindings: {
      spawnPlayer: [Input.R],
      spawnNpc: [Input.F]
    }
  })

  private npcs = []

  private readonly reactions = [
    reaction(() => this.watcher.status.spawnPlayer, spawnPlayer => {
      if (spawnPlayer) {
        const {manager} = this.context

        const players = <Agent[]>manager.listEntities()
          .map(([id, entity]) => entity)
          .filter(entity => entity instanceof Agent && entity.player)

        if (players.length === 0) {
          manager.addEntry(<AgentEntry>{
            type: "Agent",
            player: true,
            position: [0, 0, 0]
          })
        }
      }
    }),
    reaction(() => this.watcher.status.spawnNpc, spawnNpc => {
      if (spawnNpc) {
        console.log("TODO spawn NPC at origin")
      }
    })
  ]

  destructor() {
    for (const dispose of this.reactions) dispose()
  }
}
