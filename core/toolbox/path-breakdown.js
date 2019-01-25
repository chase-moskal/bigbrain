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
    function pathBreakdown(path) {
        let dirpath = "";
        let filename = "";
        if (path.includes("/")) {
            const parts = path.split("/");
            filename = parts.pop();
            dirpath = parts.join("/") + "/";
        }
        else {
            filename = path;
        }
        return { dirpath, filename };
    }
    exports.pathBreakdown = pathBreakdown;
});
//# sourceMappingURL=path-breakdown.js.map