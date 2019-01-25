(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "preact", "preact", "../babylon", "../core/ticker", "../core/viewport", "../core/conductor", "../core/overlay/components/overlay", "../core/toolbox/service-master", "../core/overlay/stores/overlay-store", "../core/overlay/stores/statistics-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const preact_1 = require("preact");
    const preact = require("preact");
    const babylon_1 = require("../babylon");
    const ticker_1 = require("../core/ticker");
    const viewport_1 = require("../core/viewport");
    const conductor_1 = require("../core/conductor");
    const overlay_1 = require("../core/overlay/components/overlay");
    const service_master_1 = require("../core/toolbox/service-master");
    const overlay_store_1 = require("../core/overlay/stores/overlay-store");
    const statistics_store_1 = require("../core/overlay/stores/statistics-store");
    /**
     * Standard monarch game
     */
    class Game extends service_master_1.ServiceMaster {
        constructor(options) {
            super();
            const { mode, canvas, gravity, entityClasses, overlayElement, maxSlowTickRate, maxLogicTickRate, maxHyperTickRate } = options;
            // babylon engine as the foundation
            const engine = new babylon_1.default.Engine(canvas, true, undefined, true);
            const scene = new babylon_1.default.Scene(engine);
            const gravityVector = babylon_1.default.Vector3.FromArray(gravity);
            const physicsPlugin = new babylon_1.default.AmmoJSPlugin();
            const physicsWorld = physicsPlugin.world;
            scene.enablePhysics(gravityVector, physicsPlugin);
            // viewport handles render loop and pointer lock
            const viewport = new viewport_1.Viewport({
                window,
                canvas,
                scene,
                engine
            });
            // 2d overlay
            const statisticsStore = new statistics_store_1.StatisticsStore();
            const overlayStore = new overlay_store_1.OverlayStore({ statisticsStore });
            const { mainMenuStore } = overlayStore;
            preact.render(preact_1.h(overlay_1.Overlay, Object.assign({}, { overlayStore })), undefined, overlayElement);
            // conductor keeps gamestate and entity replication
            const conductor = new conductor_1.Conductor({
                mode,
                entityClasses,
                context: {
                    scene,
                    window,
                    canvas,
                    engine,
                    physicsWorld,
                    overlayStore,
                    mainMenuStore
                }
            });
            const { logicTicker, hyperTicker, slowTicker } = this.makeTickers({
                maxLogicTickRate,
                maxHyperTickRate,
                maxSlowTickRate,
                viewport,
                conductor,
                statisticsStore
            });
            this.services = [
                viewport,
                logicTicker,
                hyperTicker,
                slowTicker
            ];
            this.manager = conductor.manager;
        }
        makeTickers({ maxLogicTickRate, maxHyperTickRate, maxSlowTickRate, viewport, conductor, statisticsStore }) {
            const logicTicker = new ticker_1.Ticker({
                period: 1000 / maxLogicTickRate,
                tickAction: tickInfo => conductor.logicTick(tickInfo)
            });
            const hyperTicker = new ticker_1.Ticker({
                period: 1000 / maxHyperTickRate,
                tickAction: tickInfo => conductor.hyperTick(tickInfo)
            });
            const slowTicker = new ticker_1.Ticker({
                period: 1000 / maxSlowTickRate,
                tickAction: tickInfo => {
                    conductor.hyperTick(tickInfo);
                    // track statistics
                    // TODO split this into its own stats entity, rather than hard-coding it
                    statisticsStore.recordTickerStats({
                        timeline: logicTicker.timeline,
                        slowTickRate: slowTicker.tickRate,
                        logicTickRate: logicTicker.tickRate,
                        hyperTickRate: hyperTicker.tickRate,
                        renderFrameRate: viewport.renderFrameRate
                    });
                }
            });
            return { logicTicker, hyperTicker, slowTicker };
        }
    }
    exports.Game = Game;
});
//# sourceMappingURL=game.js.map