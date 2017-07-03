
/*

const canvas = document.createElement("canvas")
const engine = new Engine(canvas, true)
const scene = new Scene(engine)
const susa = new Susa({monarch, canvas, engine, scene})

const context = {scene, host: true}

const ticker = new Ticker()
const entityClasses = {Dog, Cat, Human}
const network = new LoopbackNetwork({context})
const simulator = new Simulator({context, entityClasses})
const monarch = new Monarch({ticker, context, network, simulator})

*/

import * as BABYLON from "babylonjs"
import {Scene, Engine, PickingInfo} from "babylonjs"

import {now, Service} from "../toolbox"

export interface RenderInfo {
  since: number
}

export interface SusaOptions {
  canvas: HTMLCanvasElement
  engine: Engine
  scene: Scene
}

export default class Susa implements Service {
  private readonly canvas: HTMLCanvasElement
  private readonly engine: Engine
  private readonly scene: Scene

  private pick: PickingInfo = new PickingInfo()
  private lastRenderTime = now()

  private listeners: { [event: string]: () => void } = {
    resize: () => this.engine.resize(),
    mousemove: () => {
      this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
    },
    pointerlockchange: () => {
      if (this.scene.activeCamera) {
        const locked = (document.pointerLockElement === this.canvas)
        if (locked) this.scene.activeCamera.attachControl(this.canvas)
        else this.scene.activeCamera.detachControl(this.canvas)
      }
    }
  }

  constructor(options: SusaOptions) {
    this.canvas = options.canvas
    this.engine = options.engine
    this.scene = options.scene

    this.canvas.onclick = () => this.canvas.requestPointerLock()
    this.engine.isPointerLock = true

    // Apparently this makes Babylon care about UV mapping ¯\_(ツ)_/¯
    ;(<any> BABYLON).OBJFileLoader.OPTIMIZE_WITH_UV = true
    // this.scene.collisionsEnabled = true
    // this.scene.workerCollisions = true
  }

  destructor() {}

  /**
   * Add all stage listeners to the document
   * Start the Babylon rendering loop
   */
  start() {
    for (const eventName of Object.keys(this.listeners))
      document.addEventListener(eventName, this.listeners[eventName])

    this.engine.runRenderLoop(() => {
      const since = now() - this.lastRenderTime
      const info: RenderInfo = {since}
      this.render(info)
      this.lastRenderTime = now()
    })
  }

  /**
   * Stop the Babylon rendering loop
   * Remove all stage listeners from the document
   */
  stop() {
    this.engine.stopRenderLoop()
    for (const eventName of Object.keys(this.listeners))
      document.removeEventListener(eventName, this.listeners[eventName])
  }

  /**
   * Render a frame
   */
  protected render(info: RenderInfo) {
    this.scene.render()
  }
}
