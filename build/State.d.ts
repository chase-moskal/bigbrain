/**
 * Generic container for managing state entries.
 *  - Read and write state entries.
 *  - Run diffs and apply patches on the state.
 *  - Accumulate a patch of state change history.
 *  - Special rule: `undefined` indicates deletion. A non-existent state entry is indistinguishable from an `undefined` one.
 */
export default class State {
    /** History patch of changes made to this state's data. */
    readonly patch: StatePatch;
    /** State data storage. */
    protected readonly data: Object;
    /** Continue accumulating changes to the history patch. */
    private readonly recordPatch;
    /**
     * Create a state object.
     */
    constructor(data?: Object, {recordPatch}?: StateOptions);
    /**
     * Get the key strings for all defined state entries.
     */
    getKeys(): string[];
    /**
     * Read a state entry.
     */
    get(key: string): any;
    /**
     * Set a value in the state, at the given route.
     */
    set(routeInput: string | string[], value: any): void;
    /**
     * Delete a state entry.
     */
    delete(key: string): void;
    /**
     * Erase this state's history patch.
     */
    wipePatch(): void;
    /**
     * Calculate the state patch which transforms the given base state into this state.
     */
    diff(baseState?: State): StatePatch;
    /**
     * Apply a state patch onto this state data.
     */
    apply(patch: StatePatch): void;
    /**
     * Conform this state to match the provided new state.
     * Apply the patch that brings us to provided new state.
     */
    overwrite(newState?: State): void;
}
/**
 * Options for creating a state object.
 */
export interface StateOptions {
    recordPatch?: boolean;
}
/**
 * Patch of changes between two states.
 * State transformation description format.
 *  - undefined indicates deletion of a property.
 */
export interface StatePatch {
}
