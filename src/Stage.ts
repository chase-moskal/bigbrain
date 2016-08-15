
/**
 * Rendering stage.
 */
abstract class BabylonStage {

  /** Nifty diagnostics. */
  readonly stats = {
    totalFrames: 0
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

/** Export abstract class as default. */
export default BabylonStage

/**
 * Information passed for each rendered frame.
 */
export interface RenderInfo {

  /** Time since the last frame finished rendering. */
  since: number
}
