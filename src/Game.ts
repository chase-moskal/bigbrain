
import Logger from 'Susa/Logger'
import Stage from 'Susa/Stage'
import World from 'Susa/World'
import State from 'Susa/State'
import Loader from 'Susa/Loader'
import Entity, {EntityState} from 'Susa/Entity'

/**
 * Generic game class. Binds the pieces together.
 */
abstract class Game {

  /** Logging warnings and diagnostics to the console. */
  protected abstract readonly logger: Logger

  /** Stage manages scene rendering. */
  protected abstract readonly stage: Stage

  /** State describes the entire game world, and is the serializable source-of-truth. */
  protected abstract readonly state: State

  /** World manages entities. */
  protected abstract readonly world: World

  /**
   * Shut down.
   * Destruct all entities, cleanup event handlers, etc.
   */
  abstract destructor()

  /**
   * Start the game world.
   */
  start() { return this.world.start() }

  /**
   * Stop the game world.
   */
  stop() { return this.world.stop() }

  /**
   * Add an entity to the game based on the provided entity state.
   * TODO: Make this resolve a promise of the true Entity instance within the World.
   */
  addEntity<T extends EntityState>(entityState: T) {
    this.state.addEntityState<T>(entityState)
  }

  /**
   * Remove an entity from the state based on the provided entity id.
   * TODO: Make this resolve a promise that is resolved when the entity instance is actually removed from the world.
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

/** Export abstract class as default. */
export default Game
