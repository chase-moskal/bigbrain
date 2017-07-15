
import {HemisphericLight, FreeCamera, Mesh, Vector3, Color4, ShadowGenerator, SpotLight} from "babylonjs"

import {loadBabylonFile} from "../Susa"
import {StateEntry, Message} from "../Network"
import {Entity, LogicInput, LogicOutput} from "../Entity"

import {PlaygroundEntity} from "./Playground"

export interface EnvironmentEntry extends StateEntry {
  babylonFile: string
}

export default class Environment extends PlaygroundEntity {
  private readonly spectator = new FreeCamera("Camera", new Vector3(0, 5, -15), this.context.scene)
  private initialized = false

  async setup(entry: EnvironmentEntry) {
    const {scene} = this.context
    const {spectator} = this

    scene.clearColor = new Color4(0.2, 0.2, 0.2, 1)

    spectator.setTarget(new Vector3(0, 0, 0))
    spectator.speed = 0.25

    await loadBabylonFile(scene, entry.babylonFile)

    const plane = <Mesh> scene.getMeshByName("Plane")
    const torus = <Mesh> scene.getMeshByName("Torus")
    const icosphere = <Mesh> scene.getMeshByName("Icosphere")
    const light = <SpotLight> scene.getLightByName("Spot")

    const shadowGenerator = new ShadowGenerator(1024, light)
    const shadowCasters = [torus, icosphere]
    const shadowReceivers = [plane, torus, icosphere]
    shadowGenerator.getShadowMap().renderList.push(...shadowCasters)
    plane.receiveShadows = true
    shadowGenerator.usePoissonSampling = true
  }

  logic({entry}: LogicInput<EnvironmentEntry>): LogicOutput<EnvironmentEntry> {
    const {host, scene, canvas} = this.context

    if (scene.activeCamera !== this.spectator) {
      scene.activeCamera = this.spectator
    }

    if (!this.initialized) {
      this.initialized = true
      this.setup(entry)
    }

    return null
  }
}
