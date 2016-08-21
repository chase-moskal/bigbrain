
import Logger from 'Susa/Logger'
import Stage from 'Susa/Stage'
import World from 'Susa/World'
import State from 'Susa/State'
import Game from 'Susa/Game'
import BabylonStage from 'Susa/BabylonStage'

/**
 * Game that is wired up for the babylon engine.
 */
export default class BabylonGame extends Game {

  /** Logging warnings and diagnostics to the console. */
  protected readonly logger: Logger

  /** Stage which manages the babylon scene, rendering. */
  protected readonly stage: BabylonStage

  /** State describes the entire game world, and is the serializable source-of-truth. */
  protected readonly state: State

  /** World manages entities. */
  protected readonly world: World


  /**
   * Construct the babylon game with options.
   */
  constructor(options: BabylonGameOptions = {}) {
    super()
    this.logger = options.logger || new Logger()
    this.stage = options.stage || new BabylonStage({
      hostElement: document.body
    })
    this.state = options.state || new State
    this.world = options.world || new World({
      logger: options.logger,
      state: options.state,
      stage: options.stage
    })
  }

  /**
   * Shut down the game.
   * Destruct all entities, cleanup event handlers, etc.
   */
  destructor() {}

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
    return 0
  }
}

/**
 * Options for creating a babylon game instance.
 */
export interface BabylonGameOptions {
  stage?: BabylonStage
  logger?: Logger
  state?: State
  world?: World
}
