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
    var ModeOfConduct;
    (function (ModeOfConduct) {
        ModeOfConduct[ModeOfConduct["Alone"] = 0] = "Alone";
        ModeOfConduct[ModeOfConduct["Host"] = 1] = "Host";
        ModeOfConduct[ModeOfConduct["Client"] = 2] = "Client";
    })(ModeOfConduct = exports.ModeOfConduct || (exports.ModeOfConduct = {}));
    exports.VectorZero = [0, 0, 0];
    exports.QuaternionZero = [0, 0, 0, 0];
});
//# sourceMappingURL=interfaces.js.map