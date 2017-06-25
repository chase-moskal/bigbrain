define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Traverse a JavaScript object with a dot-notation string (or string array).
     */
    function traverseObject(object, routeInput) {
        // Convert dot-notation route input into a simple array of strings.
        const route = (typeof routeInput === 'string')
            ? routeInput.split('.')
            : routeInput;
        // Route cannot be empty.
        if (!route.length)
            throw `Cannot traverse object with empty route.`;
        // Take one route step forward.
        const routeStep = route.shift(); // Take the next route step.
        const subject = object[routeStep]; // Obtain the subject, the value of the property identified by this route step.
        // If this is the final route step, return the subject.
        if (!route.length) {
            return subject;
        }
        else {
            // All but the final traversal must be through objects (the middle of your route cannot be a primitive value).
            if (typeof subject !== 'object')
                throw `Subject is not a traversable object. routeStep=${routeStep}, route=[${route.join(',')}].`;
            // Return the recursive result.
            return traverseObject(subject, route);
        }
    }
    exports.default = traverseObject;
});
//# sourceMappingURL=traverseObject.js.map