
import {observable, computed, reaction, autorun} from "mobx"
import {FreeCamera, Mesh, ShadowGenerator, SpotLight, Vector3} from "babylonjs"

import Watcher, {Input, WatcherBindings, WatcherStatus} from "../Watcher"
import {Entity, StateEntry, Message} from "../Monarch"
import {loadBabylonFile} from "../Susa"

import {PlaygroundContext} from "./Playground"

export interface SpectatorEntry extends StateEntry {
  type: "Spectator"
  position: [number, number, number]
}

export interface SpectatorControlBindings extends WatcherBindings {
  forward: Input[]
  left: Input[]
  backward: Input[]
  right: Input[]
}

export interface SpectatorControlStatus extends WatcherStatus {
  forward: boolean
  left: boolean
  backward: boolean
  right: boolean
}

export default class Spectator extends Entity {
  private camera: FreeCamera
  private watcher = new Watcher<SpectatorControlBindings, SpectatorControlStatus>({
    bindings: {
      forward: [Input.W],
      left: [Input.A],
      backward: [Input.S],
      right: [Input.D]
    }
  })

  initialize() {
    const {host, scene} = <PlaygroundContext>(this.context)
    this.camera = new FreeCamera("Spectator Camera", Vector3.FromArray(this.entry.position), scene)
    this.camera.speed = 0.1
    scene.activeCamera = this.camera
    autorun(() => {
      console.log("specwatcher", {...this.watcher.status})
    })
  }

  terminate() {}
}
