define(["require", "exports", "Susa/Game", "Susa/BabylonStage"], function (require, exports, Game_1, BabylonStage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Game that is wired up for the babylon engine.
     */
    class BabylonGame extends Game_1.default {
        /**
         * Construct the babylon game with options.
         */
        constructor(options) {
            options.stage = options.stage || new BabylonStage_1.default({
                hostElement: options.hostElement || document.body
            });
            super(options);
        }
        /**
         * Shut down the game.
         * Destruct all entities, cleanup event handlers, etc.
         */
        destructor() {
            return Promise.resolve();
        }
        /**
         * Return the current rendering framerate (frames per second).
         */
        getFrameRate() {
            return this.stage.engine.getFps();
        }
        /**
         * Return the current logic tick rate (ticks per second).
         */
        getTickRate() {
            return 0;
        }
    }
    exports.default = BabylonGame;
});
//# sourceMappingURL=BabylonGame.js.map