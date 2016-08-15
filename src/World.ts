
import Logger from 'Susa/Toolbox/Logger'
import Game from 'Susa/Game'
import State from 'Susa/State'
import BabylonStage from 'Susa/Stage'
import Entity, {EntityState, EntityOptions} from 'Susa/Entity'
import Ticker, {TickReport} from 'Susa/Toolbox/Ticker'
declare const require: (moduleIds: string[], callback?: (...modules: any[]) => void, errback?: (error: Error) => void) => void

/**
 * World is an entity management system.
 *  - Contain collection of entity instances.
 *  - Logic routine where entities imitate the state.
 *  - Responsible for dynamically loading and instancing entities.
 */
export default class World {

  /** Logger for world events. */
  private readonly logger: Logger

  /** Parent game instance, passed to summoned entities. */
  private readonly game: Game

  /** Source of truth serializable state. */
  private readonly state: State

  /** Stage for rendering the scene. */
  private readonly stage: BabylonStage

  /** Game logic loop utility. */
  private readonly ticker: Ticker

  /** Collection of entity instances. */
  private readonly entities: { [id: string]: Entity } = {}

  /** Getter which provides an array version of entities. */
  private get entityArray(): Entity[] {
    return Object.keys(this.entities).map(id => this.entities[id])
  }

  /**
   * Construct a world instance.
   */
  constructor(options: WorldOptions) {
    this.logger = options.logger
    this.state = options.state
    this.stage = options.stage

    // Create logic ticker which runs the logic routine.
    this.ticker = new Ticker({
      tickAction: tickReport => this.logic(tickReport)
    })
  }

  /**
   * Destruct all entities and shut down.
   * This allows all event bindings and such to be cleaned up.
   */
  destructor() {}

  /**
   * Run the game rendering and logic.
   */
  start() {
    this.stage.start()
    this.ticker.start()
  }

  /**
   * Halt the game rendering and logic.
   */
  stop(): Promise<void> {
    this.stage.stop()
    return this.ticker.stop()
  }

  /**
   * Query for entities by searching through their tags.
   */
  query(terms: (string | RegExp)[] = []): Entity[] {

    return this.entityArray.filter(entity => {
      const matchingTerms = terms.filter(term =>
        entity.tags.filter(tag =>
          typeof term === 'string' ? tag === term : term.test(tag)
        ).length > 0
      )

      // Entity matches when all terms match.
      return matchingTerms.length === terms.length
    })
  }

  /**
   * Loop over each entity.
   */
  loopOverEntities(looper: (entity: Entity) => void): void {

    // Take the array of object keys, which are entity IDs.
    Object.keys(this.entities)

      // Map the IDs to the entity instances themselves.
      .map(id => this.entities[id])

      // Filter out null entities (which indicates that they are still loading).
      .filter(entity => !!entity)

      // Run each entity through the looper.
      .forEach(looper)
  }

  /**
   * Run game logic across all entities.
   */
  private logic(tickReport: TickReport): void {

    // Imitate the game state.
    this.synchronize()

    // Run all entity logic.
    this.loopOverEntities(entity => {
      entity.logic({
        state: this.state.getEntityState(entity.id),
        tickReport
      })
    })
  }

  /**
   * Compare the world to the game state, add new entities, remove missing ones.
   *  - Add new entities to the world, load them dynamically.
   *  - Remove extraneous entities from the world which aren't in the game state.
   *  - Return a report about added/removed entities.
   */
  private synchronize(): Promise<WorldLogicOutput> {
    const added: Promise<Entity>[] = []
    const removed: Promise<string>[] = []

    // Add entities that are present in the game state, but are missing from this world.
    this.state.loopOverEntityStates((entityState, id) => {
      if (!this.entities.hasOwnProperty(id))
        added.push(this.summonEntity(id, entityState).then(() => undefined))
    })

    // Remove entities that are missing from the game state, but are present in this game world.
    this.state.loopOverEntityStates((entityState, id) => {
      if (!this.state.getEntityState(id))
        removed.push(this.banishEntity(id).then(() => id))
    })

    // Return a report of all added or removed entities.
    return Promise.all<any>([Promise.all(added), Promise.all(removed)])
      .then((results: any) => ({
        added: results[0],
        removed: results[1]
      }))
  }

  /**
   * Dynamically load up and instantiate an entity, based on a given id and entity state object.
   */
  private summonEntity(id: string, entityState: EntityState): Promise<Entity> {
    return new Promise<Entity>((resolve, reject) => {

      // Entity is set to null in the collection while the entity is loading.
      // If we didn't do this, the world might try to add the same entity again.
      this.entities[id] = null

      // Gather input to instance the entity.
      const entityInput = <EntityOptions>{
        id,
        entityState,
        tags: entityState.tags,
        logger: this.logger,
        game: this.game,
        world: this,
        stage: this.stage
      }

      // Handle completed loading for the entity's javascript module.
      const onEntityLoad = entityModule => {

        // Instantiate the entity.
        const entity = new entityModule.default(entityInput)

        // Add it to the collection.
        this.entities[id] = entity

        // Log about it
        this.logger.log(`(+) Added entity ${entity}`)

        // Resolve the promise with the added entity.
        resolve(entity)
      }

      // Load the entity.
      require([entityState.type], onEntityLoad, reject)
    })
    .catch(error => {
      console.error(`Failed to load entity (${entityState.type})`)
      console.error(error)
    })
  }

  /**
   * Destruct and remove an entity instance from the game world.
   */
  private banishEntity(id: string): Promise<void> {
    const entity = this.entities[id]
    entity.destructor()
    delete this.entities[id]
    this.logger.log(`(-) Removed entity ${entity}`)
    return Promise.resolve()
  }
}

/**
 * Options to create a world.
 */
export interface WorldOptions {
  logger: Logger
  state: State
  stage: BabylonStage
}

/**
 * Output from world logic.
 */
export interface WorldLogicOutput {

  /** Entity instances which were added. */
  added: Entity[]

  /** The IDs of entity instances which were removed. */
  removed: string[]
}
