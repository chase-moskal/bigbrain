
import {HemisphericLight, FreeCamera, Mesh, Vector3, Color4, ShadowGenerator, SpotLight} from "babylonjs"

import {loadBabylonFile} from "../Susa"
import {StateEntry, Message} from "../Network"
import {Entity, LogicInput, LogicOutput} from "../Entity"

import {PlaygroundEntity} from "./Playground"

export interface EnvironmentEntry extends StateEntry {}
export interface EnvironmentMessage extends Message {}

export default class Environment extends PlaygroundEntity {
  private readonly spectator = new FreeCamera("Camera", new Vector3(0, 5, -15), this.context.scene)

  constructor(o) {
    super(o)
    const {host, scene, canvas} = this.context
    const {spectator} = this

    scene.clearColor = new Color4(0.2, 0.2, 0.2, 1)

    spectator.setTarget(new Vector3(0, 0, 0))
    spectator.speed = 0.25

    loadBabylonFile(scene, "assets/playground.babylon")
      .then(() => {
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
      })
      .catch(e => console.log(e))
  }

  logic({entry}: LogicInput<EnvironmentEntry>) {
    const {host, scene, canvas} = this.context

    if (scene.activeCamera !== this.spectator) {
      scene.activeCamera = this.spectator
    }

    return null
  }
}
