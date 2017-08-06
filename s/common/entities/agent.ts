
import {reaction} from "mobx"
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import {Context} from "../game"
import {Entity} from "../../monarch"
import Watcher, {Input} from "../../watcher"
import {makeActiveCamera} from "../tools/camtools"

import Editor from "./editor"

export interface AgentEntry {
  type: "Agent"
  player: boolean
  position: [number, number, number]
}

export default class Agent extends Entity<Context, AgentEntry> {

  private readonly watcher = new Watcher({
    eventTarget: this.context.window,
    bindings: {
      suicide: [Input.R]
    }
  })

  private readonly camera = makeActiveCamera({
    scene: this.context.scene,
    position: [0, 5, 5],
    speed: 0.1
  })

  private readonly reactions = [
    reaction(() => this.watcher.status.suicide, suicide => {
      if (suicide) {
        console.log("agent suicide", this.id)
        this.context.manager.removeEntry(this.id)
      }
    })
  ]

  private readonly greeting = (() => {
    console.log("agent spawn", this.id)
    return true
  })()

  readonly player = this.entry.player

  destructor() {
    for (const dispose of this.reactions) dispose()
    {
      const editor = <Editor>this.context.manager.getEntities().find(entity => entity instanceof Editor)
      this.context.scene.activeCamera = editor.camera
    }
    this.camera.dispose()
  }
}
