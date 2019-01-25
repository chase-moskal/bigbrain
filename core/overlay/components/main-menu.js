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
    let MainMenu = class MainMenu extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.handleLookSensitivityChange = (event) => {
                this.props.store.setLookSensitivity(event.target.value);
            };
        }
        render() {
            const { statisticsStore } = this.props.store;
            return (preact_1.h("div", { className: "main-menu" },
                this.renderLookSensitivitySetting(),
                preact_1.h(Statistics, Object.assign({}, { statisticsStore }))));
        }
        renderLookSensitivitySetting() {
            const { store } = this.props;
            const std = {
                min: 1,
                max: 100,
                value: store.lookSensitivity
            };
            return (preact_1.h("div", { class: "setting look-sensitivity" },
                preact_1.h("label", null, "Look sensitivity"),
                preact_1.h("div", { class: "input-wrapper" },
                    preact_1.h("input", Object.assign({ className: "look-sensitivity-range", type: "range" }, std, { onChange: this.handleLookSensitivityChange, onMouseMove: this.handleLookSensitivityChange }))),
                preact_1.h("div", { class: "input-wrapper" },
                    preact_1.h("input", Object.assign({ className: "look-sensitivity-number", type: "number" }, std, { onChange: this.handleLookSensitivityChange, onKeyDown: this.handleLookSensitivityChange })))));
        }
    };
    MainMenu = __decorate([
        mobx_preact_1.observer
    ], MainMenu);
    exports.MainMenu = MainMenu;
    let Statistics = class Statistics extends preact_1.Component {
        render() {
            const { statisticsStore } = this.props;
            return (preact_1.h("div", { className: "stats" },
                preact_1.h("div", { "data-stat": "hyper" },
                    preact_1.h("label", null, "Hyper"),
                    preact_1.h("output", null, statisticsStore.hyperTickRate.toFixed(0))),
                preact_1.h("div", { "data-stat": "logic" },
                    preact_1.h("label", null, "Logic"),
                    preact_1.h("output", null, statisticsStore.logicTickRate.toFixed(0))),
                preact_1.h("div", { "data-stat": "slow" },
                    preact_1.h("label", null, "Slow"),
                    preact_1.h("output", null, statisticsStore.slowTickRate.toFixed(0))),
                preact_1.h("div", { "data-stat": "render" },
                    preact_1.h("label", null, "Render"),
                    preact_1.h("output", null, statisticsStore.renderFrameRate.toFixed(0))),
                preact_1.h("div", { "data-stat": "timeline" },
                    preact_1.h("label", null, "Time"),
                    preact_1.h("output", null, (statisticsStore.timeline / 1000).toFixed(1)))));
        }
    };
    Statistics = __decorate([
        mobx_preact_1.observer
    ], Statistics);
});
//# sourceMappingURL=main-menu.js.map