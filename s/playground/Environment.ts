
import {HemisphericLight, FreeCamera, Mesh, Vector3, Color4} from "babylonjs"

import {StateEntry, Message} from "../Network"
import {Entity, LogicInput, LogicOutput} from "../Entity"

import {PlaygroundEntity} from "./Playground"

export interface EnvironmentEntry extends StateEntry {}
export interface EnvironmentMessage extends Message {}

export default class Environment extends PlaygroundEntity {
  private readonly floor = Mesh.CreateGround("Floor", 10, 10, 2, this.context.scene)
  private readonly light = new HemisphericLight("Light", new Vector3(1, 4, 2), this.context.scene)
  private readonly spectator = new FreeCamera("Camera", new Vector3(0, 1, -15), this.context.scene)

  constructor(o) {
    super(o)
    this.context.scene.clearColor = new Color4(0.5, 0.75, 1, 1)
  }

  destructor() {
    this.context.scene.removeMesh(this.floor)
    this.context.scene.removeLight(this.light)
    this.context.scene.removeCamera(this.spectator)
  }

  logic({tick, entry, messages}: LogicInput<EnvironmentEntry, EnvironmentMessage>): LogicOutput<EnvironmentEntry, EnvironmentMessage> {
    const {scene, host} = this.context

    if (scene.activeCamera !== this.spectator) {
      scene.activeCamera = this.spectator
      this.spectator.attachControl(this.context.canvas, false)
    }

    return {entry, messages: []}
  }
}
