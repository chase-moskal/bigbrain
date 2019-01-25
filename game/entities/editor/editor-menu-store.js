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
        define(["require", "exports", "mobx", "../../../core/overlay/stores/menu-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const menu_store_1 = require("../../../core/overlay/stores/menu-store");
    class AdditionTool {
        constructor() {
            this.label = "Add";
            this.tooltip = "Addition tool, insert props into the world";
        }
    }
    exports.AdditionTool = AdditionTool;
    class SelectionTool {
        constructor() {
            this.label = "Select";
            this.tooltip = "Selection tool, edit or remove props";
        }
    }
    exports.SelectionTool = SelectionTool;
    class EditorMenuStore extends menu_store_1.MenuStore {
        constructor() {
            super(...arguments);
            this.label = "Editing";
            this.activeTool = null;
            this.tools = [
                new AdditionTool(),
                new SelectionTool()
            ];
        }
        setActiveTool(tool) {
            this.activeTool = tool;
        }
    }
    __decorate([
        mobx_1.observable
    ], EditorMenuStore.prototype, "label", void 0);
    __decorate([
        mobx_1.observable
    ], EditorMenuStore.prototype, "activeTool", void 0);
    __decorate([
        mobx_1.observable
    ], EditorMenuStore.prototype, "tools", void 0);
    __decorate([
        mobx_1.action
    ], EditorMenuStore.prototype, "setActiveTool", null);
    exports.EditorMenuStore = EditorMenuStore;
});
//# sourceMappingURL=editor-menu-store.js.map