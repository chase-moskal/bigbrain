var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mobx", "../../../core/entity", "../../plugins/look-plugin", "../../plugins/move-plugin", "../../plugins/prop-plugin", "../../tools/camtools", "./editor-menu", "./create-laser-dot", "./editor-menu-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const entity_1 = require("../../../core/entity");
    const look_plugin_1 = require("../../plugins/look-plugin");
    const move_plugin_1 = require("../../plugins/move-plugin");
    const prop_plugin_1 = require("../../plugins/prop-plugin");
    const camtools_1 = require("../../tools/camtools");
    const editor_menu_1 = require("./editor-menu");
    const create_laser_dot_1 = require("./create-laser-dot");
    const editor_menu_store_1 = require("./editor-menu-store");
    class Editor extends entity_1.Entity {
        constructor() {
            super(...arguments);
            this.camera = camtools_1.makeBasicCamera({
                scene: this.context.scene,
                bearings: this.entry.bearings
            });
            this.plugins = [
                new move_plugin_1.MovePlugin({
                    node: this.camera,
                    stickStore: this.context.overlayStore.stick1
                }),
                new prop_plugin_1.PropPlugin({
                    scene: this.context.scene,
                    canvas: this.context.canvas,
                    manager: this.context.manager
                })
            ];
            this.hyperPlugins = [
                new look_plugin_1.LookPlugin({
                    node: this.camera,
                    engine: this.context.engine,
                    mainMenuStore: this.context.mainMenuStore,
                    stickStore: this.context.overlayStore.stick2
                })
            ];
            this.menu = new editor_menu_store_1.EditorMenuStore();
            this.reactions = [
                mobx_1.autorun(() => {
                    const { scene } = this.context;
                    const { activeTool } = this.menu;
                    const toolRequiresLaserDot = (activeTool instanceof editor_menu_store_1.SelectionTool
                        || activeTool instanceof editor_menu_store_1.AdditionTool);
                    if (toolRequiresLaserDot) {
                        if (!this.laserDot)
                            this.laserDot = create_laser_dot_1.createLaserDot({ scene });
                    }
                    else if (this.laserDot) {
                        this.laserDot.material.dispose();
                        this.laserDot.dispose();
                        this.laserDot = null;
                    }
                })
            ];
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                const { overlayStore } = this.context;
                const { menuBar } = overlayStore;
                menuBar.addMenu(this.menu, editor_menu_1.EditorMenu);
                overlayStore.addStickSubscriber();
            });
        }
        logicTick(tickInfo) {
            const { laserDot } = this;
            for (const plugin of this.plugins)
                plugin.logic(tickInfo);
            // position the laser dot
            if (laserDot) {
                const pick = this.middlePick();
                if (pick && pick.hit) {
                    laserDot.position = pick.pickedPoint.clone();
                    laserDot.setEnabled(true);
                }
                else {
                    laserDot.position.set(0, 0, 0);
                    laserDot.setEnabled(false);
                }
            }
        }
        hyperTick(tickInfo) {
            for (const plugin of this.hyperPlugins)
                plugin.logic(tickInfo);
        }
        deconstruct() {
            return __awaiter(this, void 0, void 0, function* () {
                const { overlayStore } = this.context;
                const { menuBar } = overlayStore;
                menuBar.removeMenu(this.menu);
                overlayStore.subtractStickSubscriber();
                this.camera.dispose();
                for (const plugin of this.plugins)
                    plugin.destructor();
                for (const dispose of this.reactions)
                    dispose();
            });
        }
        middlePick() {
            const { scene, canvas } = this.context;
            const { width, height } = canvas;
            return scene.pick(width / 2, height / 2);
        }
    }
    exports.Editor = Editor;
});
//# sourceMappingURL=editor.js.map