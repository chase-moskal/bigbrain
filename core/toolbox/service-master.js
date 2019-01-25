(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ServiceMaster {
        deconstruct() {
            for (const service of this.services)
                service.deconstruct();
        }
        start() {
            for (const service of this.services)
                service.start();
        }
        stop() {
            for (const service of this.services)
                service.stop();
        }
    }
    exports.ServiceMaster = ServiceMaster;
});
//# sourceMappingURL=service-master.js.map