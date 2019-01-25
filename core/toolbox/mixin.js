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
    // mixin decorator
    exports.mixin = (...sources) => (target) => {
        for (const source of sources) {
            for (const name of Object.getOwnPropertyNames(source.prototype))
                target.prototype[name] = source.prototype[name];
        }
    };
});
//# sourceMappingURL=mixin.js.map