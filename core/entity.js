var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
        define(["require", "exports", "mobx", "deep-freeze", "./toolbox/copy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const deepFreeze = require("deep-freeze");
    const copy_1 = require("./toolbox/copy");
    class Entity {
        constructor(options) {
            this.inbox = [];
            Object.assign(this, options);
        }
        get entry() {
            const raw = this.state.entries.get(this.id);
            return raw
                ? deepFreeze(copy_1.copy(raw))
                : raw;
        }
        logicTick(tick) { }
        hyperTick(tick) { }
        slowTick(tick) { }
    }
    __decorate([
        mobx_1.observable
    ], Entity.prototype, "inbox", void 0);
    exports.Entity = Entity;
    class GenericEntity extends Entity {
        initialize() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        deconstruct() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    }
    exports.GenericEntity = GenericEntity;
});
//# sourceMappingURL=entity.js.map