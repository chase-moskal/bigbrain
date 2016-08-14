
import Logger from 'Susa/Toolbox/Logger'
import Stage from 'Susa/Stage'
import World from 'Susa/World'
import State from 'Susa/State'
import Loader from 'Susa/Toolbox/BabylonLoader'
import Entity, {EntityState} from 'Susa/Entity'

/** Export abstract class as default. */
export default Game

/**
 * Generic game class. Binds the pieces together.
 */
abstract class Game {

  /** Logging utility function. */
  protected readonly logger: Logger

  /** Serializable source-of-truth. */
  protected readonly state: State

  /** Stage which manages the scene rendering. */
  protected readonly stage: Stage

  /** World which manages entities. */
  protected readonly world: World

  /**
   * Create and wire up the engine components that the game is comprised of.
   */
  constructor(options: GameOptions) {
    this.logger = options.logger
    this.state = options.state
    this.stage = options.stage

    this.world = new World({
      logger: this.logger,
      state: this.state,
      stage: this.stage
    })
  }

  /**
   * Shut down.
   * This allows all entities to destruct, thus removing their event bindings which might otherwise cause errors if not removed.
   */
  destructor() {}

  /**
   * Add an entity to the game based on the provided entity state.
   * TODO: Make this return a promise of the true Entity instance within the World.
   */
  addEntity<T extends EntityState>(entityState: T) {
    this.state.addEntityState<T>(entityState)
  }

  /**
   * Remove an entity from the state based on the provided entity id.
   * TODO: Make this return a promise that is resolved when the entity instance is actually removed from the world.
   */
  removeEntity(id: string) {
    this.state.removeEntityState(id)
  }

  /**
   * Return the current rendering framerate (frames per second).
   */
  abstract getFrameRate(): number

  /**
   * Return the current logic tick rate (ticks per second).
   */
  abstract getTickRate(): number
}

/**
 * Options for creating a Game.
 */
export interface GameOptions {
  logger: Logger
  state: State
  stage: Stage
}
