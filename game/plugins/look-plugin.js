(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../babylon", "../../core/toolbox/cap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../../babylon");
    const cap_1 = require("../../core/toolbox/cap");
    class Freelook {
        constructor() {
            this.horizontal = 0;
            this.vertical = 0;
        }
        add(horizontal, vertical) {
            this.horizontal += horizontal;
            this.vertical += vertical;
            this.vertical = cap_1.cap(this.vertical, -(Math.PI / 2), Math.PI / 2);
        }
    }
    class LookPlugin {
        constructor({ engine, node, stickStore, mainMenuStore }) {
            this.freelook = new Freelook();
            this.eventHandlers = {
                mousemove: (event) => {
                    const { movementX, movementY } = event;
                    if (this.engine.isPointerLock && !isNaN(movementX) && !isNaN(movementY)) {
                        const { freelook } = this;
                        const sensitivity = this.getSensitivity();
                        freelook.add(movementX * sensitivity, movementY * sensitivity);
                    }
                }
            };
            this.node = node;
            this.engine = engine;
            this.stickStore = stickStore;
            this.mainMenuStore = mainMenuStore;
            for (const eventName of Object.keys(this.eventHandlers)) {
                window.addEventListener(eventName, this.eventHandlers[eventName], false);
            }
        }
        logic(tick) {
            this.ascertainThumblook();
            this.enactLook();
        }
        destructor() {
            const { eventHandlers } = this;
            for (const eventName of Object.keys(eventHandlers)) {
                window.removeEventListener(eventName, eventHandlers[eventName]);
            }
        }
        getSensitivity() {
            return this.mainMenuStore.lookSensitivity / 10000;
        }
        ascertainThumblook() {
            const { stickStore, freelook } = this;
            const { angle, force } = stickStore;
            if (force > 0) {
                const x = Math.cos(angle);
                const y = -Math.sin(angle);
                const factor = force * (this.getSensitivity() * 10);
                freelook.add(x * factor, y * factor);
            }
        }
        enactLook() {
            const { freelook, node } = this;
            if (!freelook)
                return;
            const { horizontal, vertical } = freelook;
            const quaternion = babylon_1.default.Quaternion.RotationYawPitchRoll(horizontal, vertical, 0);
            node.rotationQuaternion = quaternion;
        }
    }
    exports.LookPlugin = LookPlugin;
});
//# sourceMappingURL=look-plugin.js.map