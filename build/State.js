define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generic container for managing state entries.
     *  - Read and write state entries.
     *  - Run diffs and apply patches on the state.
     *  - Accumulate a patch of state change history.
     *  - Special rule: `undefined` indicates deletion. A non-existent state entry is indistinguishable from an `undefined` one.
     */
    class State {
        /**
         * Create a state object.
         */
        constructor(data = {}, { recordPatch = false } = {}) {
            this.recordPatch = recordPatch;
            // Deep clone of the serializable data.
            this.data = JSON.parse(JSON.stringify(data));
        }
        /**
         * Get the key strings for all defined state entries.
         */
        getKeys() {
            // Get all state keys which are not undefined.
            const definedStateKeys = Object.keys(this.data)
                .filter(key => this.data[key] !== undefined);
            // Return the state data's keys.
            return definedStateKeys;
        }
        /**
         * Read a state entry.
         */
        get(key) {
            return this.data[key];
        }
        /**
         * Set a value in the state, at the given route.
         */
        set(routeInput, value) {
            // This will have to be based on recursive functionality similar to traverseObject.
        }
        /**
         * Delete a state entry.
         */
        delete(key) {
            // Delete the state entry from the data directly.
            delete this.data[key];
            // `undefined` represents state entry deletion.
            if (this.recordPatch)
                this.patch[key] = undefined;
        }
        /**
         * Erase this state's history patch.
         */
        wipePatch() {
            for (const key of Object.keys(this.patch))
                delete this.patch[key];
        }
        /**
         * Calculate the state patch which transforms the given base state into this state.
         */
        diff(baseState = new State({}, { recordPatch: true })) { throw 'coming soon'; }
        /**
         * Apply a state patch onto this state data.
         */
        apply(patch) { throw 'coming soon'; }
        /**
         * Conform this state to match the provided new state.
         * Apply the patch that brings us to provided new state.
         */
        overwrite(newState = new State()) {
            const patchToNewState = newState.diff(this);
            this.apply(patchToNewState);
        }
    }
    exports.default = State;
});
//# sourceMappingURL=State.js.map