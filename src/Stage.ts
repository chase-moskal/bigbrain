
/** Export abstract class as default. */
export default Stage

/**
 * Rendering stage.
 */
abstract class Stage {

  /** HTML element which contains the game's rendering canvas. */
  readonly hostElement: HTMLElement

  /** Nifty diagnostics. */
  readonly stats = {
    totalFrames: 0
  }

  /**
   * Construct a stage with options.
   */
  constructor(options: StageOptions) {
    this.hostElement = options.hostElement
  }

  /**
   * Render a frame.
   */
  protected render(info: RenderInfo) {
    this.stats.totalFrames++
  }

  /** Start the rendering loop. */
  abstract start()

  /** Stop the rendering loop. */
  abstract stop()
}

/**
 * Options for creating a new stage.
 */
export interface StageOptions {

  /** HTML element to inject the canvas within. */
  hostElement: HTMLElement
}

/**
 * Information passed for each rendered frame.
 */
export interface RenderInfo {

  /** Time since the last frame finished rendering. */
  since: number
}
