
import State from './State'
import {EntityData} from './Entity'

/**
 * World state is specialized for tracking entities.
 */
export default class WorldState extends State {

  /** Entity ID pulling station — get new IDs here. */
  private nextId = 0
  private readonly pullId = () => (++this.nextId).toString()

  /** World state data. */
  protected data: WorldData = {entities: {}}

  /**
   * Get an array of defined entity state ids.
   */
  getEntityIds(): string[] {

    // The entity object keys are entity IDs.
    return Object.keys(this.data.entities)

        // Filter out undefined entities.
        .filter(id => this.data.entities[id] !== undefined)
  }

  /**
   * Get an entity's state data.
   */
  getEntityData(id: string): EntityData {
    return this.get('entities')[id]
  }

  /**
   * Add an entity to state.
   */
  addEntity<T extends EntityData>(entityData: T) {}

  /**
   * Delete an entity from the state.
   */
  deleteEntity(id: string): void {}

  /**
   * Getter for an array of all defined entities.
   */
  get entities(): Object {
    const entityStates = this.get('entities')
    const definedEntities = {}

    for (const id in this.getEntityIds()) definedEntities[id] = entityStates[id]

    Object.freeze(definedEntities)
    return definedEntities
  }
}

/**
 * Serializable description of a game world.
 */
export interface WorldData {

  /** Describe entities in the game world. */
  entities: { [id: string]: EntityData }
}
