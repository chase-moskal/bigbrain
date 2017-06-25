define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Run an action function on the given object, each of its properties, and recurse through each object.
     */
    function walkObject(subject, action) {
        action(subject);
        if (subject instanceof Object) {
            for (const key of Object.keys(subject)) {
                const value = subject[key];
                walkObject(value, action);
            }
        }
    }
    exports.default = walkObject;
});
//# sourceMappingURL=walkObject.js.map