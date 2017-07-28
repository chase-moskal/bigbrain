
import {observable, computed, reaction} from "mobx"
import {FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3} from "babylonjs"

import {loadBabylonFile} from "../Susa"
import {Entity, StateEntry, Message} from "../Monarch"

import {PlaygroundContext} from "./Playground"

export interface SpectatorEntry extends StateEntry {
  type: "Spectator"
  position: [number, number, number]
}

export default class Spectator extends Entity {
  private camera: FreeCamera

  initialize() {
    const {host, scene} = <PlaygroundContext>(this.context)
    this.camera = new FreeCamera("Spectator Camera", Vector3.FromArray(this.entry.position), scene)
    this.camera.speed = 0.1
    scene.activeCamera = this.camera
  }

  terminate() {}
}
