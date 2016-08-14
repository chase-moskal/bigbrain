
import {EntityState} from 'Susa/Entity'

/**
 * Serializable source-of-truth which describes the entire game world.
 */
export default class State {

  /** Collection of entity state. */
  private readonly entityStates: { [id: string]: EntityState } = {}

  /** Entity id pulling station. */
  private readonly pullId = () => (++this.nextId).toString()
  private nextId = 0

  /**
   * Loop over each entity state.
   */
  loopOverEntityStates(looper: (entityState: EntityState, id: string) => void): void {
    for (const id of Object.keys(this.entityStates))
      looper(this.entityStates[id], id)
  }

  /**
   * Obtain a particular entity state.
   */
  getEntityState(id: string) {
    return this.entityStates[id]
  }

  /**
   * Add entity state.
   */
  addEntityState<T extends EntityState>(entityState: T) {
    this.entityStates[this.pullId()] = entityState
  }

  /**
   * Remove entity state.
   */
  removeEntityState(id: string) {
    delete this.entityStates[id]
  }
}
