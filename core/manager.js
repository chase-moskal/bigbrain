(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "uuid/v4"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const uuid = require("uuid/v4");
    /**
     * State manager
     *  - public access to administrative game functions
     *  - entities have access to this via context
     */
    class Manager {
        constructor({ state, entities }) {
            Object.assign(this, { state, entities });
        }
        getEntities() {
            return Array.from(this.entities).map(([id, entity]) => entity);
        }
        addEntry(entry) {
            const id = uuid();
            this.state.entries.set(id, entry);
            return id;
        }
        removeEntry(id) {
            this.state.entries.delete(id);
        }
    }
    exports.Manager = Manager;
});
//# sourceMappingURL=manager.js.map