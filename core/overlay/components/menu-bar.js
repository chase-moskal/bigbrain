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
        define(["require", "exports", "preact", "mobx-preact"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const preact_1 = require("preact");
    const mobx_preact_1 = require("mobx-preact");
    let MenuBar = class MenuBar extends preact_1.Component {
        render() {
            const { store: barStore } = this.props;
            return (preact_1.h("div", { className: "menu-bar" }, barStore.menus.map(({ store: menuStore, Component: MenuComponent, open, setOpen }) => (preact_1.h("div", { className: "menu", "data-open": open ? "true" : "false" },
                preact_1.h("div", { className: "menu-button", onClick: () => setOpen() }, menuStore.label),
                open
                    ? (preact_1.h("div", { className: "menu-panel" }, preact_1.h(MenuComponent, { store: menuStore })))
                    : null)))));
        }
    };
    MenuBar = __decorate([
        mobx_preact_1.observer
    ], MenuBar);
    exports.MenuBar = MenuBar;
});
//# sourceMappingURL=menu-bar.js.map