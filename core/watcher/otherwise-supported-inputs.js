(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./input"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const input_1 = require("./input");
    exports.otherwiseSupportedInputs = [
        input_1.Input.MouseLeft,
        input_1.Input.MouseMiddle,
        input_1.Input.MouseRight
    ];
});
//# sourceMappingURL=otherwise-supported-inputs.js.map