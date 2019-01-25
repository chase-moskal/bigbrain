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
    class MenuBarStore {
        constructor() {
            this.menus = [];
        }
        addMenu(store, Component) {
            this.menus.push({
                store,
                Component,
                open: false,
                setOpen: (open) => this.setOpen(store, open)
            });
        }
        removeMenu(obsolete) {
            this.menus = this.menus.filter(({ store }) => store !== obsolete);
        }
        setOpen(store, open) {
            const menu = this.menus.find(m => m.store === store);
            const lastOpen = menu.open;
            for (const menu of this.menus)
                menu.open = false;
            menu.open = (open === undefined || open === null)
                ? !lastOpen
                : open;
        }
    }
    __decorate([
        mobx_1.observable
    ], MenuBarStore.prototype, "menus", void 0);
    __decorate([
        mobx_1.action
    ], MenuBarStore.prototype, "addMenu", null);
    __decorate([
        mobx_1.action
    ], MenuBarStore.prototype, "removeMenu", null);
    __decorate([
        mobx_1.action
    ], MenuBarStore.prototype, "setOpen", null);
    exports.MenuBarStore = MenuBarStore;
});
//# sourceMappingURL=menu-bar-store.js.map