define(["require", "exports", "Susa/State"], function (require, exports, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * World state is specialized for tracking entities.
     */
    class WorldState extends State_1.default {
        constructor() {
            super(...arguments);
            /** Entity ID pulling station — get new IDs here. */
            this.nextId = 0;
            this.pullId = () => (++this.nextId).toString();
            /** World state data. */
            this.data = { entities: {} };
        }
        /**
         * Get an array of defined entity state ids.
         */
        getEntityIds() {
            // The entity object keys are entity IDs.
            return Object.keys(this.data.entities)
                .filter(id => this.data.entities[id] !== undefined);
        }
        /**
         * Get an entity's state data.
         */
        getEntityData(id) {
            return this.get('entities')[id];
        }
        /**
         * Add an entity to state.
         */
        addEntity(entityData) { }
        /**
         * Delete an entity from the state.
         */
        deleteEntity(id) { }
        /**
         * Getter for an array of all defined entities.
         */
        get entities() {
            const entityStates = this.get('entities');
            const definedEntities = {};
            for (const id in this.getEntityIds())
                definedEntities[id] = entityStates[id];
            Object.freeze(definedEntities);
            return definedEntities;
        }
    }
    exports.default = WorldState;
});
//# sourceMappingURL=WorldState.js.map