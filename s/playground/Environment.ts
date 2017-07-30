
import {observable, computed, reaction} from "mobx"
import {FreeCamera, Mesh, ShadowGenerator, SpotLight} from "babylonjs"

import {loadBabylonFile} from "../Susa"
import {Entity, StateEntry, Message} from "../Monarch"

import {PlaygroundContext} from "./Playground"

export interface EnvironmentEntry extends StateEntry {
  type: "Environment"
  asset: string
}

export default class EnvironmentEntity extends Entity {

  constructor(o) {
    super(o)
    const {host, scene} = <PlaygroundContext>(this.context)
    loadBabylonFile(scene, this.entry.asset)
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
  }

  terminate() {}
}
