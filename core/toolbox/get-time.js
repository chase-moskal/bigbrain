(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./environment"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const environment_1 = require("./environment");
    /**
     * Current time in milliseconds
     * - counts elapsed browser session time
     */
    function getTime() {
        if (environment_1.environment === "browser")
            return performance.now();
        else {
            const t = process.hrtime();
            return Math.round((t[0] * 1000) + (t[1] / 1000000));
        }
    }
    exports.getTime = getTime;
});
//# sourceMappingURL=get-time.js.map