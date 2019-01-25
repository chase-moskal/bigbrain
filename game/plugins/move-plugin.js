(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../core/watcher/watcher", "../tools/traversal"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const watcher_1 = require("../../core/watcher/watcher");
    const traversal_1 = require("../tools/traversal");
    class MovePlugin {
        constructor({ node, stickStore }) {
            this.watcher = new watcher_1.Watcher({
                bindings: traversal_1.traversiveBindings
            });
            this.node = node;
            this.stickStore = stickStore;
        }
        logic(tick) {
            const { node, stickStore, watcher } = this;
            const { angle, force } = stickStore;
            traversal_1.enactMovement({
                node,
                move: traversal_1.ascertainMovement({
                    watcher,
                    stickInfo: { angle, force },
                    timeFactor: tick.timeSinceLastTick / 50
                })
            });
        }
        destructor() {
            this.watcher.destructor();
        }
    }
    exports.MovePlugin = MovePlugin;
});
//# sourceMappingURL=move-plugin.js.map