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
        define(["require", "exports", "preact", "mobx-preact", "../../../game/tools/thumbstick"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const preact_1 = require("preact");
    const mobx_preact_1 = require("mobx-preact");
    const thumbstick_1 = require("../../../game/tools/thumbstick");
    let Stick = class Stick extends preact_1.Component {
        componentDidMount() {
            this.thumbstick = new thumbstick_1.Thumbstick({
                zone: this.base,
                onMove: info => {
                    const { stickStore } = this.props;
                    stickStore.setInfo(info);
                }
            });
        }
        componentWillUnmount() {
            this.thumbstick.destructor();
            this.thumbstick = null;
        }
        render() {
            const { stickStore } = this.props;
            return preact_1.h("div", { className: "stick", style: {
                    display: stickStore.active ? "block" : "none"
                } });
        }
    };
    Stick = __decorate([
        mobx_preact_1.observer
    ], Stick);
    exports.Stick = Stick;
});
//# sourceMappingURL=stick.js.map