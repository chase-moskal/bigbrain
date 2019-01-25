var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./toolbox/get-entity-class"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const get_entity_class_1 = require("./toolbox/get-entity-class");
    function replicate({ context, state, entities, entityClasses }) {
        return __awaiter(this, void 0, void 0, function* () {
            const initiates = [];
            const degenerates = [];
            // add new entities
            for (const [id, entry] of Array.from(state.entries)) {
                if (!entities.has(id)) {
                    const Entity = get_entity_class_1.getEntityClass(entry.type, entityClasses);
                    const entity = new Entity({ id, context, state });
                    entities.set(id, entity);
                    initiates.push(entity.initialize());
                }
            }
            // remove old entities
            for (const id of entities.keys()) {
                if (!state.entries.has(id)) {
                    const entity = entities.get(id);
                    degenerates.push(entity.deconstruct());
                    entities.delete(id);
                }
            }
            // wait for all initiations and degenerations
            yield Promise.all([...initiates, ...degenerates]);
        });
    }
    exports.replicate = replicate;
});
//# sourceMappingURL=replicate.js.map