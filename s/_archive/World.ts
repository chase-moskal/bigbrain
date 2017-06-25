
import Game from './Game'
import Logger from './Logger'
import BabylonStage from './Stage'
import {GameUpdate} from './Network'
import WorldState from './WorldState'
import Ticker, {Tick} from './Ticker'
import Entity, {EntityOptions, EntityMessage, EntityData} from './Entity'

declare const require: (moduleIds: string[], callback?: (...modules: any[]) => void, errback?: (error: Error) => void) => void

/**
 * World is an entity management system.
 *  - Contain collection of entity instances.
 *  - Logic routine where entities imitate the game state.
 *  - Responsible for dynamically loading and instancing entities.
 */
export default class World {

  /** Collection of entity instances. */
  readonly entities: { [id: string]: Entity } = {}

  /** Logger for world events. */
  private readonly logger: Logger

  /** Parent game instance, passed to summoned entities. */
  private readonly game: Game

  /** Stage for rendering the scene. */
  private readonly stage: BabylonStage

  /**
   * Construct a world instance.
   */
  constructor(options: WorldOptions) {
    this.logger = options.logger
    this.game = options.game
    this.stage = options.stage
  }

  /**
   * Destruct all entities and shut down.
   * This allows all event bindings and such to be cleaned up.
   */
  destructor(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Get an array of all entity ids.
   */
  getEntityIds(): string[] {
    return Object.keys(this.entities)
  }

  /**
   * Get an entity instance by its ID.
   */
  getEntity(id: string) {
    return this.entities[id]
  }

  /**
   * Get an array of all entities.
   */
  getEntities() {

    // Take the array of object keys, which are entity IDs.
    return Object.keys(this.entities)

      // Map the IDs to the entity instances themselves.
      .map(id => this.entities[id])

      // Filter out null entities (which indicates that they are still loading).
      .filter(entity => !!entity)
  }

  /**
   * Query for entities by searching through their tags.
   */
  query(terms: (string | RegExp)[] = []): Entity[] {

    // Return an array of matching entities.
    return this.getEntities().filter(entity => {

      // Determine which of the provided terms match this entity's tags.
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
   * Dynamically load up and instantiate an entity, based on a given id and entity state object.
   */
  summonEntity(id: string, data: EntityData): Promise<Entity> {

    // Actually used as a module path to import the entity.
    const type: string = data.type

    // Gather input to instance the entity.
    const entityInput = <EntityOptions>{
      id,
      data,
      world: this,
      game: this.game,
      stage: this.stage,
      logger: this.logger
    }

    // Entity is set to null in the collection while the entity is loading.
    // If we didn't do this, the world might try to add the same entity again.
    this.entities[id] = null

    // Asynchronous loading.
    return new Promise<Entity>((resolve, reject) => {

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
      require([type], onEntityLoad, reject)
    })
    .catch(error => {
      console.error(`Failed to load entity (${type})`)
      console.error(error)
      return error
    })
  }

  /**
   * Destruct and remove an entity instance from the game world.
   */
  banishEntity(id: string): Promise<void> {
    const entity = this.entities[id]
    return entity.destructor()
      .then(() => {
        delete this.entities[id]
        this.logger.log(`(-) Removed entity ${entity}`)
      })
  }
}

/**
 * Options to create a world.
 */
export interface WorldOptions {
  logger: Logger
  game: Game
  stage: BabylonStage
}
