var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mobx", "../toolbox/copy", "../toolbox/assign-props-onto-map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const copy_1 = require("../toolbox/copy");
    const assign_props_onto_map_1 = require("../toolbox/assign-props-onto-map");
    class Network {
        constructor({ state, mode, handleMessages }) {
            Object.assign(this, { state, mode, handleMessages });
        }
        applyUpdate(update) {
            const { state } = this;
            const { allEntries, someEntries } = update;
            if (allEntries) {
                state.entries.clear();
                assign_props_onto_map_1.assignPropsOntoMap(copy_1.copy(allEntries), state.entries);
            }
            if (someEntries) {
                Object.keys(someEntries).forEach(key => {
                    const entry = state.entries.get(key);
                    if (entry) {
                        const fresh = copy_1.copy(someEntries[key]);
                        state.entries.set(key, fresh);
                    }
                });
            }
            this.handleMessages(update.messages);
        }
    }
    __decorate([
        mobx_1.action
    ], Network.prototype, "applyUpdate", null);
    exports.Network = Network;
});
//# sourceMappingURL=network.js.map