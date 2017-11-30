
import Stage from './Stage'
import World from './World'
import Logger from './Logger'
import Loader from './Loader'
import Network, {GameUpdate} from './Network'
import {StatePatch} from './State'
import WorldState from './WorldState'
import Ticker, {Tick} from './Ticker'
import Entity, {EntityData, EntityMessage} from './Entity'

/**
 * Generic game class.
 */
abstract class Game {

  /** Network streams patches and messages, and handles connections. */
  protected abstract readonly network: Network

  /** Ticker is the heartbeat of the game, which actuates the mainloop. */
  protected readonly ticker: Ticker

  /** State stores and manages game data. */
  protected abstract readonly state: WorldState

  /** World manages entities. */
  protected abstract readonly world: World

  /** Stage for scene rendering. */
  protected abstract readonly stage: Stage

  /** Logger writes to the console. */
  protected abstract readonly logger: Logger

  /**
   * Construct a new game.
   */
  constructor(options: GameOptions) {
    this.stage = options.stage

    this.logger = options.logger || new Logger()
    this.state = options.state || new WorldState()
    this.network = options.network || new Network()

    this.ticker = options.ticker || new Ticker({
      action: tick => this.mainloop(tick)
    })

    this.world = options.world || new World({
      game: this,
      stage: this.stage,
      logger: this.logger
    })
  }

  /**
   * Shut down.
   * Destruct all entities, cleanup event handlers, etc.
   */
  abstract destructor(): Promise<void>

  /**
   * Return the current rendering framerate (frames per second).
   */
  abstract getFrameRate(): number

  /**
   * Return the current logic tick rate (ticks per second).
   */
  abstract getTickRate(): number

  /**
   * Start the game world.
   */
  start(): void {
    this.stage.start()
    return this.ticker.start()
  }

  /**
   * Stop the game world.
   */
  stop(): Promise<void> {
    this.stage.stop()
    return this.ticker.stop()
  }

  /**
   * Add an entity to the game based on the provided entity state.
   * TODO: Make this resolve a promise of the true Entity instance within the World.
   */
  addEntity<T extends EntityData>(entityData: T) {
    this.state.addEntity<T>(entityData)
  }

  /**
   * Remove an entity from the state based on the provided entity id.
   * TODO: Make this resolve a promise that is resolved when the entity instance is actually removed from the world.
   */
  removeEntity(id: string) {
    this.state.deleteEntity(id)
  }

  /**
   * Main game routine.
   */
  protected mainloop(tick: Tick) {
    const {state, world, network} = this

    // [1] RECEIVE
    // Receive the official game update from the network.
    const {patches, messages} = network.receive()

    // [2] APPLY
    // Apply patches to our world state.
    for (const patch of patches) state.apply(patch)

    // [3] SYNC
    // Sync the world entities to match state, deliver message to entity inboxes.
    this.sync(messages)

    // [4] LOGIC
    // Run entity logic routines.
    const outgoingUpdate = this.logic(tick)

    // [5] SEND
    // Send locally generated patches and messages to the host.
    network.send(outgoingUpdate)
  }

  /**
   * Synchronize the world to match the state.
   *  - Add/remove world entities to reflect state.
   *  - Update entity data and deliver messages to inboxes.
   *  - Return a promised report.
   */
  private sync(messages: EntityMessage[]): Promise<{

    /** Entity instances which were added. */
    added: Entity[]

    /** The IDs of entity instances which were removed. */
    removed: string[]
  }> {
    const {state, world} = this

    const added: Promise<Entity>[] = []
    const removed: Promise<string>[] = []

    const stateEntityIds = state.getEntityIds()
    const entities = world.getEntities()

    // Add new entities to the world, load them dynamically.
    for (const id of stateEntityIds) {
      if (!world.entities.hasOwnProperty(id)) {
        const entityPromise = world.summonEntity(id, state.getEntityData(id))
        added.push(entityPromise)
      }
    }

    // Remove extraneous entities from the world (when they aren't in state).
    for (const entity of entities) {
      if (!state.getEntityData(entity.id)) {
        const removalPromise = world.banishEntity(entity.id).then(() => entity.id)
        removed.push(removalPromise)
      }
    }

    // Update entity data and inboxes.
    for (const entity of entities) {
      entity.data = state.getEntityData(entity.id)
      entity.inbox = messages.filter(message => message.entityId === entity.id)
    }

    // Return a report of all added or removed entities.
    return Promise.all<any>([Promise.all(added), Promise.all(removed)])
      .then(([added, removed]) => ({added, removed}))
  }

  /**
   * Entity logic routine.
   */
  private logic(tick: Tick): GameUpdate {
    const {state, world} = this
    const entities = world.getEntities()

    // Run entity logic.
    for (const entity of entities) entity.logic(tick)

    // Aggregate a single outgoing patch.
    const patch = {}

    // Aggregate messages.
    const messages: EntityMessage[] = entities

      // Array of outboxes.
      .map(entity => entity.outbox)

      // Flatten to an array of messages.
      .reduce((a, b) => a.concat(b), [])

    // Return an outgoing game update.
    return {patches: [patch], messages}
  }
}

/** Export abstract class as default. */
export default Game

/**
 * Options for constructing a game.
 */
export interface GameOptions {
  stage?: Stage
  world?: World
  logger?: Logger
  ticker?: Ticker
  network?: Network
  state?: WorldState
}
