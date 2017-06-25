define(["require", "exports", "Susa/World", "Susa/Logger", "Susa/Network", "Susa/WorldState", "Susa/Ticker"], function (require, exports, World_1, Logger_1, Network_1, WorldState_1, Ticker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generic game class.
     */
    class Game {
        /**
         * Construct a new game.
         */
        constructor(options) {
            this.stage = options.stage;
            this.logger = options.logger || new Logger_1.default();
            this.state = options.state || new WorldState_1.default();
            this.network = options.network || new Network_1.default();
            this.ticker = options.ticker || new Ticker_1.default({
                action: tick => this.mainloop(tick)
            });
            this.world = options.world || new World_1.default({
                game: this,
                stage: this.stage,
                logger: this.logger
            });
        }
        /**
         * Start the game world.
         */
        start() {
            this.stage.start();
            return this.ticker.start();
        }
        /**
         * Stop the game world.
         */
        stop() {
            this.stage.stop();
            return this.ticker.stop();
        }
        /**
         * Add an entity to the game based on the provided entity state.
         * TODO: Make this resolve a promise of the true Entity instance within the World.
         */
        addEntity(entityData) {
            this.state.addEntity(entityData);
        }
        /**
         * Remove an entity from the state based on the provided entity id.
         * TODO: Make this resolve a promise that is resolved when the entity instance is actually removed from the world.
         */
        removeEntity(id) {
            this.state.deleteEntity(id);
        }
        /**
         * Main game routine.
         */
        mainloop(tick) {
            const { state, world, network } = this;
            // [1] RECEIVE
            // Receive the official game update from the network.
            const { patches, messages } = network.receive();
            // [2] APPLY
            // Apply patches to our world state.
            for (const patch of patches)
                state.apply(patch);
            // [3] SYNC
            // Sync the world entities to match state, deliver message to entity inboxes.
            this.sync(messages);
            // [4] LOGIC
            // Run entity logic routines.
            const outgoingUpdate = this.logic(tick);
            // [5] SEND
            // Send locally generated patches and messages to the host.
            network.send(outgoingUpdate);
        }
        /**
         * Synchronize the world to match the state.
         *  - Add/remove world entities to reflect state.
         *  - Update entity data and deliver messages to inboxes.
         *  - Return a promised report.
         */
        sync(messages) {
            const { state, world } = this;
            const added = [];
            const removed = [];
            const stateEntityIds = state.getEntityIds();
            const entities = world.getEntities();
            // Add new entities to the world, load them dynamically.
            for (const id of stateEntityIds) {
                if (!world.entities.hasOwnProperty(id)) {
                    const entityPromise = world.summonEntity(id, state.getEntityData(id));
                    added.push(entityPromise);
                }
            }
            // Remove extraneous entities from the world (when they aren't in state).
            for (const entity of entities) {
                if (!state.getEntityData(entity.id)) {
                    const removalPromise = world.banishEntity(entity.id).then(() => entity.id);
                    removed.push(removalPromise);
                }
            }
            // Update entity data and inboxes.
            for (const entity of entities) {
                entity.data = state.getEntityData(entity.id);
                entity.inbox = messages.filter(message => message.entityId === entity.id);
            }
            // Return a report of all added or removed entities.
            return Promise.all([Promise.all(added), Promise.all(removed)])
                .then(([added, removed]) => ({ added, removed }));
        }
        /**
         * Entity logic routine.
         */
        logic(tick) {
            const { state, world } = this;
            const entities = world.getEntities();
            // Run entity logic.
            for (const entity of entities)
                entity.logic(tick);
            // Aggregate a single outgoing patch.
            const patch = {};
            // Aggregate messages.
            const messages = entities
                .map(entity => entity.outbox)
                .reduce((a, b) => a.concat(b), []);
            // Return an outgoing game update.
            return { patches: [patch], messages };
        }
    }
    /** Export abstract class as default. */
    exports.default = Game;
});
//# sourceMappingURL=Game.js.map