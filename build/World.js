define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * World is an entity management system.
     *  - Contain collection of entity instances.
     *  - Logic routine where entities imitate the game state.
     *  - Responsible for dynamically loading and instancing entities.
     */
    class World {
        /**
         * Construct a world instance.
         */
        constructor(options) {
            /** Collection of entity instances. */
            this.entities = {};
            this.logger = options.logger;
            this.game = options.game;
            this.stage = options.stage;
        }
        /**
         * Destruct all entities and shut down.
         * This allows all event bindings and such to be cleaned up.
         */
        destructor() {
            return Promise.resolve();
        }
        /**
         * Get an array of all entity ids.
         */
        getEntityIds() {
            return Object.keys(this.entities);
        }
        /**
         * Get an entity instance by its ID.
         */
        getEntity(id) {
            return this.entities[id];
        }
        /**
         * Get an array of all entities.
         */
        getEntities() {
            // Take the array of object keys, which are entity IDs.
            return Object.keys(this.entities)
                .map(id => this.entities[id])
                .filter(entity => !!entity);
        }
        /**
         * Query for entities by searching through their tags.
         */
        query(terms = []) {
            // Return an array of matching entities.
            return this.getEntities().filter(entity => {
                // Determine which of the provided terms match this entity's tags.
                const matchingTerms = terms.filter(term => entity.tags.filter(tag => typeof term === 'string' ? tag === term : term.test(tag)).length > 0);
                // Entity matches when all terms match.
                return matchingTerms.length === terms.length;
            });
        }
        /**
         * Dynamically load up and instantiate an entity, based on a given id and entity state object.
         */
        summonEntity(id, data) {
            // Actually used as a module path to import the entity.
            const type = data.type;
            // Gather input to instance the entity.
            const entityInput = {
                id,
                data,
                world: this,
                game: this.game,
                stage: this.stage,
                logger: this.logger
            };
            // Entity is set to null in the collection while the entity is loading.
            // If we didn't do this, the world might try to add the same entity again.
            this.entities[id] = null;
            // Asynchronous loading.
            return new Promise((resolve, reject) => {
                // Handle completed loading for the entity's javascript module.
                const onEntityLoad = entityModule => {
                    // Instantiate the entity.
                    const entity = new entityModule.default(entityInput);
                    // Add it to the collection.
                    this.entities[id] = entity;
                    // Log about it
                    this.logger.log(`(+) Added entity ${entity}`);
                    // Resolve the promise with the added entity.
                    resolve(entity);
                };
                // Load the entity.
                require([type], onEntityLoad, reject);
            })
                .catch(error => {
                console.error(`Failed to load entity (${type})`);
                console.error(error);
                return error;
            });
        }
        /**
         * Destruct and remove an entity instance from the game world.
         */
        banishEntity(id) {
            const entity = this.entities[id];
            return entity.destructor()
                .then(() => {
                delete this.entities[id];
                this.logger.log(`(-) Removed entity ${entity}`);
            });
        }
    }
    exports.default = World;
});
//# sourceMappingURL=World.js.map