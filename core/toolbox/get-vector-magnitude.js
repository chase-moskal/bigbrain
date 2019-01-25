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
    function getVectorMagnitude(vector) {
        return Math.sqrt((Math.pow(vector.x, 2)) + (Math.pow(vector.y, 2)) + (Math.pow(vector.z, 2)));
    }
    exports.getVectorMagnitude = getVectorMagnitude;
});
//# sourceMappingURL=get-vector-magnitude.js.map