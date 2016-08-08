
import Stage from 'Susa/Stage'
import GameState from 'Susa/GameState'
import World from 'Susa/World'
import Loader from 'Susa/Loader'
import Ticker, {TickReport} from 'Susa/Ticker'
import Entity, {EntityState} from 'Susa/Entity'

/**
 * Options for creating a Game.
 */
export interface GameOptions {
  hostElement: HTMLElement
  log: Logger
}

/** Logging function to be used freely by entities and the like. */
export type Logger = (...messages: any[]) => void

/**
 * 3D web game.
 */
export default class Game {

  /** Logging utility function. */
  log: Logger

  /** Stage which manages the Babylon scene. */
  protected stage: Stage

  /** Game state, source of truth that the world is based on. */
  protected state: GameState

  /** Maintains entity instances, synchronizes with game state. */
  protected world: World

  /** Game logic loop utility. */
  protected logicTicker: Ticker

  /**
   * Create and wire up the engine components that the game is comprised of.
   */
  constructor({hostElement, log}: GameOptions) {
    this.log = log

    // Create the Babylon stage.
    this.stage = new Stage({hostElement})

    // Create the source-of-truth game state.
    this.state = new GameState()

    // Create the game world, which contains entity instances and conforms to the game state.
    this.world = new World({
      game: this,
      stage: this.stage,
      loader: new Loader({scene: this.stage.scene})
    })

    // Create game logic ticker, and define the game logic routine.
    this.logicTicker = new Ticker({
      tick: tickReport => {
        this.world.synchronize(this.state)
        this.world.logic(this.state, tickReport)
      }
    })

    // Initialize this game.
    this.initialize()
  }

  /**
   * Tear down and de-initialize all of the game's components.
   * This allows all entities to destruct, thus removing their event bindings which might otherwise cause errors if not removed.
   */
  destructor() {}

  /**
   * Overridable game initialization step.
   * Initialize methods are handy, because you don't have to worry about all options that the constructor must accept.
   */
  protected initialize() {}

  /**
   * Add an entity to the game based on the provided entity state.
   * TODO: Make this return a promise of the true Entity instance within the World.
   */
  addEntity<T extends EntityState>(entityState: T) {
    this.state.addEntity<T>(entityState)
  }

  /**
   * Remove an entity from the state based on the provided entity id.
   * TODO: Make this return a promise that is resolved when the entity instance is actually removed from the world.
   */
  removeEntity(id: string) {
    this.state.removeEntity(id)
  }

  /**
   * Run the whole game engine.
   */
  start() {
    this.stage.start()
    this.logicTicker.start()
  }

  /**
   * Halt the whole game engine.
   */
  stop(): Promise<void> {
    this.stage.stop()
    return this.logicTicker.stop()
  }

  /**
   * Return the current number of frames being rendered per second.
   */
  getFramerate(): number {
    return this.stage.engine.getFps()
  }
}
