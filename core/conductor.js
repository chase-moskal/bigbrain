(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mobx", "./manager", "./replicate", "./network/loopback-network", "./interfaces"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const manager_1 = require("./manager");
    const replicate_1 = require("./replicate");
    const loopback_network_1 = require("./network/loopback-network");
    const interfaces_1 = require("./interfaces");
    class Conductor {
        constructor({ entityClasses, context: moreContext = {} }) {
            const state = mobx_1.observable({ entries: new Map() });
            const entities = this.entities = new Map();
            const manager = new manager_1.Manager({ state, entities });
            const mode = interfaces_1.ModeOfConduct.Alone;
            const network = new loopback_network_1.LoopbackNetwork({
                mode,
                state,
                handleMessages: messages => {
                    for (const message of messages) {
                        const entity = entities.get(message.to);
                        if (entity)
                            entity.inbox.unshift(message);
                        else
                            console.warn(`message undeliverable: to entity id "${message.to}"`, message);
                    }
                }
            });
            const context = Object.assign({}, moreContext, {
                mode,
                manager,
                network
            });
            mobx_1.autorun(() => replicate_1.replicate({ context, state, entities, entityClasses }));
            this.manager = manager;
        }
        logicTick(tickInfo) {
            for (const [id, entity] of this.entities)
                entity.logicTick(tickInfo);
        }
        hyperTick(tickInfo) {
            for (const [id, entity] of this.entities)
                entity.hyperTick(tickInfo);
        }
        slowTick(tickInfo) {
            for (const [id, entity] of this.entities)
                entity.slowTick(tickInfo);
        }
    }
    exports.Conductor = Conductor;
});
//# sourceMappingURL=conductor.js.map