define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Entity in the game world which responds to fresh entity state on logic ticks.
     * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
     */
    class Entity {
        /**
         * Create a new entity instance.
         * You can optionally provide your own label for each instance.
         */
        constructor(options) {
            /** Module ID for this entity class. Copied from the static variable. */
            this.type = this.constructor.type;
            this.id = options.id;
            this.tags = options.tags || [];
            this.logger = options.logger;
            this.game = options.game;
            this.world = options.world;
            this.stage = options.stage;
        }
        /**
         * Clean up this entity for removal from the game.
         * Tear down any event subscriptions, etc.
         */
        destructor() {
            return Promise.resolve();
        }
        worldStateDiff(state) {
            return {};
        }
        /**
         * Log formatting.
         */
        toString() { return `<${this.type}-${this.id}>`; }
    }
    /** Module ID for this entity class. Used to load entity classes on-the-fly. */
    Entity.type = 'Nanoshooter/Entities/Entity';
    /** Export abstract class as default. */
    exports.default = Entity;
});
//# sourceMappingURL=Entity.js.map