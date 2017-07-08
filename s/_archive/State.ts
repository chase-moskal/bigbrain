
/**
 * Generic container for managing state entries.
 *  - Read and write state entries.
 *  - Run diffs and apply patches on the state.
 *  - Accumulate a patch of state change history.
 *  - Special rule: `undefined` indicates deletion. A non-existent state entry is indistinguishable from an `undefined` one.
 */
export default class State {

  /** History patch of changes made to this state's data. */
  readonly patch: StatePatch

  /** State data storage. */
  protected readonly data: Object

  /** Continue accumulating changes to the history patch. */
  private readonly recordPatch: boolean

  /**
   * Create a state object.
   */
  constructor(data: Object = {}, {recordPatch = false}: StateOptions = {}) {
    this.recordPatch = recordPatch

    // Deep clone of the serializable data.
    this.data = JSON.parse(JSON.stringify(data))
  }

  /**
   * Get the key strings for all defined state entries.
   */
  getKeys(): string[] {

    // Get all state keys which are not undefined.
    const definedStateKeys = Object.keys(this.data)
      .filter(key => this.data[key] !== undefined)

    // Return the state data's keys.
    return definedStateKeys
  }

  /**
   * Read a state entry.
   */
  get(key: string): any {
    return this.data[key]
  }

  /**
   * Set a value in the state, at the given route.
   */
  set(routeInput: string | string[], value: any): void {

    // This will have to be based on recursive functionality similar to traverseObject.
  }

  /**
   * Delete a state entry.
   */
  delete(key: string): void {

    // Delete the state entry from the data directly.
    delete this.data[key]

    // `undefined` represents state entry deletion.
    if (this.recordPatch) this.patch[key] = undefined
  }

  /**
   * Erase this state's history patch.
   */
  wipePatch() {
    for (const key of Object.keys(this.patch)) delete this.patch[key]
  }

  /**
   * Calculate the state patch which transforms the given base state into this state.
   */
  diff(baseState: State = new State({}, {recordPatch: true})): StatePatch { throw 'coming soon' }

  /**
   * Apply a state patch onto this state data.
   */
  apply(patch: StatePatch): void { throw 'coming soon' }

  /**
   * Conform this state to match the provided new state.
   * Apply the patch that brings us to provided new state.
   */
  overwrite(newState: State = new State()): void {
    const patchToNewState = newState.diff(this)
    this.apply(patchToNewState)
  }
}

/**
 * Options for creating a state object.
 */
export interface StateOptions {
  recordPatch?: boolean
}

/**
 * Patch of changes between two states.
 * State transformation description format.
 *  - undefined indicates deletion of a property.
 */
export interface StatePatch {}
