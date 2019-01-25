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
    exports.getEntityClass = (type, entityClasses) => {
        const Class = entityClasses[type];
        if (!Class)
            throw new Error(`Unknown entity class "${type}"`);
        return Class;
    };
});
//# sourceMappingURL=get-entity-class.js.map