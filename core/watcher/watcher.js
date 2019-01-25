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
        define(["require", "exports", "mobx", "./input", "./input-keycode-relations", "./otherwise-supported-inputs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const input_1 = require("./input");
    const input_keycode_relations_1 = require("./input-keycode-relations");
    const otherwise_supported_inputs_1 = require("./otherwise-supported-inputs");
    class Watcher {
        constructor({ eventTarget = window, bindings }) {
            this.listeners = {
                keydown: (event) => {
                    const struckInput = this.getInputByKeycode(event.keyCode);
                    if (struckInput === null)
                        return;
                    for (const struckAlias of this.getAliasesForInput(struckInput))
                        this.status[struckAlias] = true;
                },
                keyup: (event) => {
                    const releasedInput = this.getInputByKeycode(event.keyCode);
                    if (releasedInput === null)
                        return;
                    for (const releasedAlias of this.getAliasesForInput(releasedInput))
                        this.status[releasedAlias] = false;
                },
                mousedown: (event) => {
                    for (const struckAlias of this.getAliasesForInput(input_1.Input.MouseLeft))
                        this.status[struckAlias] = true;
                },
                mouseup: (event) => {
                    for (const releasedAlias of this.getAliasesForInput(input_1.Input.MouseLeft))
                        this.status[releasedAlias] = false;
                }
            };
            this.eventTarget = eventTarget;
            this.bindings = bindings;
            // initialize status for each binding, throw error on unknown input
            const status = {};
            for (const alias of Object.keys(bindings)) {
                const inputs = bindings[alias];
                for (const input of inputs)
                    if (input_keycode_relations_1.inputKeycodeRelations.find(relation => relation.input === input) !== undefined
                        && otherwise_supported_inputs_1.otherwiseSupportedInputs.find(supported => supported === input) !== undefined)
                        throw `unknown input: ${input}`;
                status[alias] = null;
            }
            this.status = status;
            this.start();
        }
        start() {
            for (const eventType of Object.keys(this.listeners)) {
                const listener = this.listeners[eventType];
                this.eventTarget.addEventListener(eventType, listener);
            }
        }
        stop() {
            for (const eventType of Object.keys(this.listeners)) {
                const listener = this.listeners[eventType];
                this.eventTarget.removeEventListener(eventType, listener);
            }
        }
        destructor() {
            this.stop();
        }
        getInputByKeycode(code) {
            const relation = input_keycode_relations_1.inputKeycodeRelations.find(relationship => relationship.code === code);
            return relation ? relation.input : null;
        }
        getAliasesForInput(input) {
            return Object.keys(this.bindings)
                .filter(alias => this.bindings[alias].some(i => i === input));
        }
    }
    __decorate([
        mobx_1.observable
    ], Watcher.prototype, "status", void 0);
    exports.Watcher = Watcher;
});
//# sourceMappingURL=watcher.js.map