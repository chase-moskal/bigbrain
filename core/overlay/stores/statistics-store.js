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
    class StatisticsStore {
        constructor() {
            this.timeline = 0;
            this.slowTickRate = 0;
            this.logicTickRate = 0;
            this.hyperTickRate = 0;
            this.renderFrameRate = 0;
        }
        recordTickerStats({ timeline, slowTickRate, logicTickRate, hyperTickRate, renderFrameRate }) {
            this.timeline = timeline;
            this.slowTickRate = slowTickRate;
            this.logicTickRate = logicTickRate;
            this.hyperTickRate = hyperTickRate;
            this.renderFrameRate = renderFrameRate;
        }
        recordViewportStats({ renderFrameRate }) {
            this.renderFrameRate = renderFrameRate;
        }
    }
    __decorate([
        mobx_1.observable
    ], StatisticsStore.prototype, "timeline", void 0);
    __decorate([
        mobx_1.observable
    ], StatisticsStore.prototype, "slowTickRate", void 0);
    __decorate([
        mobx_1.observable
    ], StatisticsStore.prototype, "logicTickRate", void 0);
    __decorate([
        mobx_1.observable
    ], StatisticsStore.prototype, "hyperTickRate", void 0);
    __decorate([
        mobx_1.observable
    ], StatisticsStore.prototype, "renderFrameRate", void 0);
    __decorate([
        mobx_1.action
    ], StatisticsStore.prototype, "recordTickerStats", null);
    __decorate([
        mobx_1.action
    ], StatisticsStore.prototype, "recordViewportStats", null);
    exports.StatisticsStore = StatisticsStore;
});
//# sourceMappingURL=statistics-store.js.map