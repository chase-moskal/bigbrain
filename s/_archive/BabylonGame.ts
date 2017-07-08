
import Stage from './Stage'
import State from './State'
import World from './World'
import Logger from './Logger'
import Network from './Network'
import WorldState from './WorldState'
import Game, {GameOptions} from './Game'
import BabylonStage from './BabylonStage'

/**
 * Game that is wired up for the babylon engine.
 */
export default class BabylonGame extends Game {

  /** Logging warnings and diagnostics to the console. */
  readonly logger: Logger

  /** Stage which manages the babylon scene, rendering. */
  protected readonly stage: BabylonStage

  /** State describes the entire game world, and is the serializable source-of-truth. */
  protected readonly state: WorldState

  /** World manages entities. */
  protected readonly world: World

  /** Manages connections and streams game state patches and entity messages. */
  protected readonly network: Network

  /**
   * Construct the babylon game with options.
   */
  constructor(options: BabylonGameOptions) {

    options.stage = options.stage || new BabylonStage({
      hostElement: options.hostElement || document.body
    })

    super(options)
  }

  /**
   * Shut down the game.
   * Destruct all entities, cleanup event handlers, etc.
   */
  destructor(): Promise<void> {
    return Promise.resolve()
  }

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
export interface BabylonGameOptions extends GameOptions {

  /** Babylon stage to use. */
  stage?: BabylonStage

  /** Host element used by the default stage. If `stage` is provided, this `hostElement` option is ignored. */
  hostElement?: HTMLElement
}
