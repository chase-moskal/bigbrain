
import Stage, {RenderInfo} from 'Susa/Stage'
import BabylonLoader from 'Susa/BabylonLoader'

/**
 * Govern a 3D Babylon scene from a high level.
 * An access point to key Babylon API components for controlling the 3D scene.
 */
export default class BabylonStage extends Stage {

  /** HTML element which contains the game's rendering canvas. */
  readonly hostElement: HTMLElement

  /** Canvas HTML element which the game renders to. */
  readonly canvas: HTMLCanvasElement

  /** Babylon engine instance. */
  readonly engine: BABYLON.Engine

  /** Babylon scene instance. */
  readonly scene: BABYLON.Scene

  /** Utility to load assets into the Babylon scene. */
  readonly loader: BabylonLoader

  /** Information about where the user's mouse cursor is hovering in the 3D scene. Updated on mousemove by the stage. */
  pick: BABYLON.PickingInfo = new BABYLON.PickingInfo()

  /** For measuring the time between frames. */
  private lastRenderTime = performance.now()

  /** Event listeners that start and stop with the stage. */
  private listeners: { [event: string]: () => void } = {

    // Prompt the BabylonJS engine to resize.
    resize: () => {
      this.engine.resize()
    },

    // Update the picking info about the user's mouse cursor in the 3D scene.
    mousemove: () => {
      this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
    },

    // Start and stop pointer lock input.
    pointerlockchange: () => {
      if (this.scene.activeCamera) {
        const locked = (document.pointerLockElement === this.canvas)
        if (locked)
          this.scene.activeCamera.attachControl(this.canvas)
        else
          this.scene.activeCamera.detachControl(this.canvas)
      }
    }
  }

  /**
   * Accept stage options and initialize the stage's babylon components.
   */
  constructor(options: BabylonStageOptions) {
    super()

    this.hostElement = options.hostElement
    this.canvas = document.createElement('canvas')
    this.engine = new BABYLON.Engine(this.canvas, true)
    this.scene = new BABYLON.Scene(this.engine)

    this.hostElement.appendChild(this.canvas)

    // this.scene.collisionsEnabled = true
    // this.scene.workerCollisions = true

    this.canvas.onclick = () => this.canvas.requestPointerLock()
    this.engine.isPointerLock = true

    // Apparently this makes Babylon care about UV mapping ¯\_(ツ)_/¯
    ; (<any>BABYLON).OBJFileLoader.OPTIMIZE_WITH_UV = true
  }

  /**
   * Add all stage listeners to the document.
   * Start the Babylon rendering loop.
   */
  start() {

    // Add all listeners to the document.
    for (const eventName of Object.keys(this.listeners))
      document.addEventListener(eventName, this.listeners[eventName])

    // Run Babylon's render loop.
    this.engine.runRenderLoop(() => {
      const since = performance.now() - this.lastRenderTime
      const info: RenderInfo = {since}
      this.render(info)
      this.lastRenderTime = performance.now()
    })
  }

  /**
   * Stop the Babylon rendering loop.
   * Remove all stage listeners from the document.
   */
  stop() {

    // Halt Babylon's render loop.
    this.engine.stopRenderLoop()

    // Remove all stage listeners from the document.
    for (const eventName of Object.keys(this.listeners))
      document.removeEventListener(eventName, this.listeners[eventName])
  }

  /**
   * Render a frame.
   */
  protected render(info: RenderInfo) {
    this.scene.render()
    super.render(info)
  }
}

/**
 * Options for creating a new stage.
 */
export interface BabylonStageOptions {

  /** HTML element to inject the canvas within. */
  hostElement: HTMLElement
}
