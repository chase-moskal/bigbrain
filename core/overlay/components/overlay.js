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
        define(["require", "exports", "preact", "mobx-preact", "./stick", "./menu-bar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const preact_1 = require("preact");
    const mobx_preact_1 = require("mobx-preact");
    const stick_1 = require("./stick");
    const menu_bar_1 = require("./menu-bar");
    let Overlay = class Overlay extends preact_1.Component {
        render() {
            const { overlayStore } = this.props;
            return (preact_1.h("div", { className: "overlay" },
                preact_1.h(menu_bar_1.MenuBar, { store: overlayStore.menuBar }),
                overlayStore.sticksEngaged
                    ? (preact_1.h("div", { className: "thumbsticks" },
                        preact_1.h(stick_1.Stick, { stickStore: overlayStore.stick1 }),
                        preact_1.h(stick_1.Stick, { stickStore: overlayStore.stick2 })))
                    : null));
        }
    };
    Overlay = __decorate([
        mobx_preact_1.observer
    ], Overlay);
    exports.Overlay = Overlay;
});
//# sourceMappingURL=overlay.js.map