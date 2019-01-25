(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nipplejs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const nipplejs = require("nipplejs");
    const defaultThumbstickInfo = { angle: 0, force: 0 };
    class Thumbstick {
        constructor({ zone, onMove = () => { } }) {
            this.info = Object.assign({}, defaultThumbstickInfo);
            const move = (info) => {
                this.info = info;
                onMove(info);
            };
            const manager = this.manager = nipplejs.create({
                zone,
                size: 120,
                color: "rgba(255,255,255, 0.5)",
                mode: "static",
                position: { bottom: "50%", left: "50%" }
            });
            manager.on("start end", (event, instance) => move(defaultThumbstickInfo));
            manager.on("move", (event, data) => move({
                angle: data.angle.radian,
                force: data.force
            }));
        }
        destructor() {
            this.manager.destroy();
            this.manager = null;
        }
    }
    exports.Thumbstick = Thumbstick;
});
//# sourceMappingURL=thumbstick.js.map