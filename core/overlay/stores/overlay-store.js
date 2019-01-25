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
        define(["require", "exports", "mobx", "../components/main-menu", "./stick-store", "./menu-bar-store", "./main-menu-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const main_menu_1 = require("../components/main-menu");
    const stick_store_1 = require("./stick-store");
    const menu_bar_store_1 = require("./menu-bar-store");
    const main_menu_store_1 = require("./main-menu-store");
    class OverlayStore {
        constructor({ statisticsStore }) {
            this.stick1 = new stick_store_1.StickStore();
            this.stick2 = new stick_store_1.StickStore();
            this.stickSubscribers = 0;
            const mainMenuStore = this.mainMenuStore = new main_menu_store_1.MainMenuStore({
                statisticsStore
            });
            const menuBar = this.menuBar = new menu_bar_store_1.MenuBarStore();
            menuBar.addMenu(mainMenuStore, main_menu_1.MainMenu);
        }
        get sticksEngaged() {
            return (this.stickSubscribers > 0);
        }
        addStickSubscriber() {
            this.stickSubscribers += 1;
        }
        subtractStickSubscriber() {
            this.stickSubscribers -= 1;
        }
    }
    __decorate([
        mobx_1.observable
    ], OverlayStore.prototype, "stickSubscribers", void 0);
    __decorate([
        mobx_1.computed
    ], OverlayStore.prototype, "sticksEngaged", null);
    __decorate([
        mobx_1.action
    ], OverlayStore.prototype, "addStickSubscriber", null);
    __decorate([
        mobx_1.action
    ], OverlayStore.prototype, "subtractStickSubscriber", null);
    exports.OverlayStore = OverlayStore;
});
//# sourceMappingURL=overlay-store.js.map