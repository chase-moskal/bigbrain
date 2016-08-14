
import Game from 'Susa/Game'
import World from 'Susa/World'
import BabylonStage from 'Susa/BabylonStage'

/**
 * Babylon game.
 */
export default class BabylonGame extends Game {

  /** Stage which manages the Babylon scene. */
  protected readonly stage: BabylonStage

  /** World which manages entities. */
  protected readonly world: World

  /**
   * Return the current rendering framerate (frames per second).
   */
  getFrameRate(): number {
    return this.stage.engine.getFps()
  }

  /**
   * Return the current logic tick rate (ticks per second).
   */
  getTickRate(): number {
    throw 'TODO'
  }
}
