
import State from 'Susa/State'
import {EntityState} from 'Susa/Entity'

/**
 * Serializable source-of-truth which describes everything (all entities) of the game at the current moment.
 */
export default class GameState extends State {

  /** Collection of entity state. */
  private readonly entities: { [id: string]: EntityState } = {}

  /** Entity id pulling station. */
  private pullId = () => (++this.nextId).toString()
  private nextId = 0

  /**
   * Loop over each entity state.
   */
  loopOverEntities(looper: (entityState: EntityState, id: string) => void): void {
    for (const id of Object.keys(this.entities))
      looper(this.entities[id], id)
  }

  /**
   * Obtain a particular entity state.
   */
  getEntityState(id: string) {
    return this.entities[id]
  }

  /**
   * Add entity state.
   */
  addEntity<T extends EntityState>(entityState: T) {
    this.entities[this.pullId()] = entityState
  }

  /**
   * Remove entity state.
   */
  removeEntity(id: string) {
    delete this.entities[id]
  }
}
