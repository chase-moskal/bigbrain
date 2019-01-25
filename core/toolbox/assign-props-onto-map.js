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
    function assignPropsOntoMap(obj, map) {
        Object.keys(obj).forEach(key => map.set(key, obj[key]));
    }
    exports.assignPropsOntoMap = assignPropsOntoMap;
});
//# sourceMappingURL=assign-props-onto-map.js.map