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
    exports.inputKeycodeRelations = [
        { input: input_1.Input.W, code: 87 },
        { input: input_1.Input.A, code: 65 },
        { input: input_1.Input.S, code: 83 },
        { input: input_1.Input.D, code: 68 },
        { input: input_1.Input.Q, code: 81 },
        { input: input_1.Input.E, code: 69 },
        { input: input_1.Input.Z, code: 90 },
        { input: input_1.Input.X, code: 88 },
        { input: input_1.Input.C, code: 67 },
        { input: input_1.Input.R, code: 82 },
        { input: input_1.Input.F, code: 70 },
        { input: input_1.Input.V, code: 86 },
        { input: input_1.Input.Shift, code: 16 },
        { input: input_1.Input.Ctrl, code: 17 },
        { input: input_1.Input.Alt, code: 18 },
        { input: input_1.Input.Space, code: 32 },
        { input: input_1.Input.ArrowLeft, code: 37 },
        { input: input_1.Input.ArrowUp, code: 38 },
        { input: input_1.Input.ArrowRight, code: 39 },
        { input: input_1.Input.ArrowDown, code: 40 },
        { input: input_1.Input.One, code: 49 },
        { input: input_1.Input.Two, code: 50 },
        { input: input_1.Input.Three, code: 51 },
        { input: input_1.Input.Four, code: 52 },
        { input: input_1.Input.Five, code: 53 },
        { input: input_1.Input.Six, code: 54 },
        { input: input_1.Input.Seven, code: 55 },
        { input: input_1.Input.Eight, code: 56 },
        { input: input_1.Input.Nine, code: 57 },
        { input: input_1.Input.Zero, code: 48 },
        { input: input_1.Input.Backspace, code: 8 },
        { input: input_1.Input.Delete, code: 46 }
    ];
});
//# sourceMappingURL=input-keycode-relations.js.map