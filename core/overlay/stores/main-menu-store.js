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
        define(["require", "exports", "mobx", "./menu-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const menu_store_1 = require("./menu-store");
    const storageKeyLookSensitivity = "monarch-look-sensitivity";
    const getStorageLookSensitivity = () => {
        const value = localStorage.getItem(storageKeyLookSensitivity);
        return value ? JSON.parse(value) : 50;
    };
    const saveStorageLookSensitivity = (value) => {
        localStorage.setItem(storageKeyLookSensitivity, JSON.stringify(value));
    };
    class MainMenuStore extends menu_store_1.MenuStore {
        constructor({ statisticsStore }) {
            super();
            this.label = "Menu";
            this.lookSensitivity = getStorageLookSensitivity();
            this.statisticsStore = statisticsStore;
        }
        setLookSensitivity(value) {
            this.lookSensitivity = value;
            saveStorageLookSensitivity(value);
        }
    }
    __decorate([
        mobx_1.observable
    ], MainMenuStore.prototype, "label", void 0);
    __decorate([
        mobx_1.observable
    ], MainMenuStore.prototype, "lookSensitivity", void 0);
    __decorate([
        mobx_1.observable
    ], MainMenuStore.prototype, "statisticsStore", void 0);
    __decorate([
        mobx_1.action
    ], MainMenuStore.prototype, "setLookSensitivity", null);
    exports.MainMenuStore = MainMenuStore;
});
//# sourceMappingURL=main-menu-store.js.map