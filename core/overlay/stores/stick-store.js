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
        define(["require", "exports", "mobx"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    class StickStore {
        constructor() {
            this.active = true;
        }
        setInfo({ angle, force }) {
            this.angle = angle;
            this.force = force;
        }
        setActive(active) {
            this.active = active;
        }
    }
    __decorate([
        mobx_1.observable
    ], StickStore.prototype, "angle", void 0);
    __decorate([
        mobx_1.observable
    ], StickStore.prototype, "force", void 0);
    __decorate([
        mobx_1.observable
    ], StickStore.prototype, "active", void 0);
    __decorate([
        mobx_1.action
    ], StickStore.prototype, "setInfo", null);
    __decorate([
        mobx_1.action
    ], StickStore.prototype, "setActive", null);
    exports.StickStore = StickStore;
});
//# sourceMappingURL=stick-store.js.map