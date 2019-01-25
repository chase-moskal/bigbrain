(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./babylon", "./core/conductor", "./core/entity", "./core/interfaces", "./core/manager", "./core/replicate", "./core/ticker", "./core/viewport", "./core/network/loopback-network", "./core/network/network", "./core/overlay/components/main-menu", "./core/overlay/components/menu-bar", "./core/overlay/components/overlay", "./core/overlay/components/stick", "./core/overlay/stores/main-menu-store", "./core/overlay/stores/menu-bar-store", "./core/overlay/stores/menu-store", "./core/overlay/stores/overlay-store", "./core/overlay/stores/statistics-store", "./core/overlay/stores/stick-store", "./core/toolbox/assign-props-onto-map", "./core/toolbox/cap", "./core/toolbox/copy", "./core/toolbox/create-round-camera-rig", "./core/toolbox/environment", "./core/toolbox/generate-id", "./core/toolbox/get-entity-class", "./core/toolbox/get-time", "./core/toolbox/get-vector-magnitude", "./core/toolbox/identical", "./core/toolbox/load-babylon-assets", "./core/toolbox/mixin", "./core/toolbox/path-breakdown", "./core/toolbox/service-master", "./core/toolbox/sleep", "./core/watcher/input-keycode-relations", "./core/watcher/input", "./core/watcher/otherwise-supported-inputs", "./core/watcher/watcher", "./game/game", "./game/entities/ground", "./game/entities/terrain", "./game/entities/cube/create-cube-ghost-mesh", "./game/entities/cube/create-cube-mesh", "./game/entities/cube/create-cube-proposal-mesh", "./game/entities/cube/cube", "./game/entities/editor/create-laser-dot", "./game/entities/editor/editor-menu-store", "./game/entities/editor/editor-menu", "./game/entities/editor/editor-prop-boss", "./game/entities/editor/editor", "./game/plugins/look-plugin", "./game/plugins/move-plugin", "./game/plugins/prop-plugin", "./game/tools/camtools", "./game/tools/thumbstick", "./game/tools/traversal"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./babylon"));
    __export(require("./core/conductor"));
    __export(require("./core/entity"));
    __export(require("./core/interfaces"));
    __export(require("./core/manager"));
    __export(require("./core/replicate"));
    __export(require("./core/ticker"));
    __export(require("./core/viewport"));
    __export(require("./core/network/loopback-network"));
    __export(require("./core/network/network"));
    __export(require("./core/overlay/components/main-menu"));
    __export(require("./core/overlay/components/menu-bar"));
    __export(require("./core/overlay/components/overlay"));
    __export(require("./core/overlay/components/stick"));
    __export(require("./core/overlay/stores/main-menu-store"));
    __export(require("./core/overlay/stores/menu-bar-store"));
    __export(require("./core/overlay/stores/menu-store"));
    __export(require("./core/overlay/stores/overlay-store"));
    __export(require("./core/overlay/stores/statistics-store"));
    __export(require("./core/overlay/stores/stick-store"));
    __export(require("./core/toolbox/assign-props-onto-map"));
    __export(require("./core/toolbox/cap"));
    __export(require("./core/toolbox/copy"));
    __export(require("./core/toolbox/create-round-camera-rig"));
    __export(require("./core/toolbox/environment"));
    __export(require("./core/toolbox/generate-id"));
    __export(require("./core/toolbox/get-entity-class"));
    __export(require("./core/toolbox/get-time"));
    __export(require("./core/toolbox/get-vector-magnitude"));
    __export(require("./core/toolbox/identical"));
    __export(require("./core/toolbox/load-babylon-assets"));
    __export(require("./core/toolbox/mixin"));
    __export(require("./core/toolbox/path-breakdown"));
    __export(require("./core/toolbox/service-master"));
    __export(require("./core/toolbox/sleep"));
    __export(require("./core/watcher/input-keycode-relations"));
    __export(require("./core/watcher/input"));
    __export(require("./core/watcher/otherwise-supported-inputs"));
    __export(require("./core/watcher/watcher"));
    __export(require("./game/game"));
    __export(require("./game/entities/ground"));
    __export(require("./game/entities/terrain"));
    __export(require("./game/entities/cube/create-cube-ghost-mesh"));
    __export(require("./game/entities/cube/create-cube-mesh"));
    __export(require("./game/entities/cube/create-cube-proposal-mesh"));
    __export(require("./game/entities/cube/cube"));
    __export(require("./game/entities/editor/create-laser-dot"));
    __export(require("./game/entities/editor/editor-menu-store"));
    __export(require("./game/entities/editor/editor-menu"));
    __export(require("./game/entities/editor/editor-prop-boss"));
    __export(require("./game/entities/editor/editor"));
    __export(require("./game/plugins/look-plugin"));
    __export(require("./game/plugins/move-plugin"));
    __export(require("./game/plugins/prop-plugin"));
    __export(require("./game/tools/camtools"));
    __export(require("./game/tools/thumbstick"));
    __export(require("./game/tools/traversal"));
});
//# sourceMappingURL=index.js.map