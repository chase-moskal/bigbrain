(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./network"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const network_1 = require("./network");
    class LoopbackNetwork extends network_1.Network {
        send(update) {
            this.applyUpdate(update);
        }
    }
    exports.LoopbackNetwork = LoopbackNetwork;
});
//# sourceMappingURL=loopback-network.js.map