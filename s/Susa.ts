
import {Scene, Engine, PickingInfo, Camera, Vector3} from "babylonjs"

import {now, Service} from "./toolbox"

export interface RenderInfo {
  since: number
}

export interface SusaOptions {
  scene: Scene
  engine: Engine
  window: Window
  canvas: HTMLCanvasElement
}

export default class Susa implements Service {
  private readonly scene: Scene
  private readonly engine: Engine
  private readonly window: Window
  private readonly document: Document
  private readonly canvas: HTMLCanvasElement

  private readonly fallbackCamera: Camera
  private pick: PickingInfo = new PickingInfo()
  private lastRenderTime = now()

  private readonly listeners: { [eventName: string]: () => void } = {

    resize: () => {
      this.engine.resize()
    },

    mousemove: () => {
      this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
    },

    pointerlockchange: () => {
      if (this.scene.activeCamera) {
        const locked = (this.document.pointerLockElement === this.canvas)
        if (locked) this.scene.activeCamera.attachControl(this.canvas)
        else this.scene.activeCamera.detachControl(this.canvas)
      }
    }
  }

  constructor(options: SusaOptions) {
    this.window = options.window
    this.document = options.window.document
    this.canvas = options.canvas
    this.engine = options.engine
    this.scene = options.scene

    this.canvas.onclick = () => this.canvas.requestPointerLock()
    this.engine.isPointerLock = true

    this.fallbackCamera = new Camera("FallbackCamera", new Vector3(0, 1, -15), this.scene)
    if (!this.scene.activeCamera) this.scene.activeCamera = this.fallbackCamera
  }

  destructor() {}

  /**
   * Add all stage listeners to the document
   * Start the Babylon rendering loop
   */
  start() {
    for (const eventName of Object.keys(this.listeners))
      this.window.addEventListener(eventName, this.listeners[eventName])

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
      this.window.removeEventListener(eventName, this.listeners[eventName])
  }

  /**
   * Render a frame
   */
  protected render(info: RenderInfo) {
    this.scene.render()
  }
}
