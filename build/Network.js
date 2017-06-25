define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Network component.
     * All game state changes are streaming through this component.
     * Perform necessary network interactions with the game state deltas, and stream back changes to our game state.
     */
    class Network {
        constructor() {
            /** Inbox array of network io packets which are ready to be received. */
            this.inbox = [];
        }
        /**
         * Receive official game updates from the network.
         */
        receive() {
            return {
                patches: [],
                messages: []
            };
        }
        /**
         * Send local game update to the host.
         */
        send(update) { }
    }
    exports.default = Network;
});
//# sourceMappingURL=Network.js.map