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
    let EditorMenu = class EditorMenu extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.handleToolClick = (event) => {
                const { store } = this.props;
                const label = event.srcElement.textContent.trim();
                const tool = store.tools.find(t => t.label.toLowerCase() === label.toLowerCase());
                store.setActiveTool(store.activeTool === tool ? null : tool);
                event.preventDefault();
                return false;
            };
        }
        renderToolbar() {
            const { store } = this.props;
            return (preact_1.h("div", { class: "tools" }, store.tools.map(tool => preact_1.h("button", { className: "tool", title: tool.tooltip, onClick: this.handleToolClick, "data-active": store.activeTool === tool ? "true" : "false" }, tool.label))));
        }
        render() {
            return (preact_1.h("div", { class: "editor-menu" }, this.renderToolbar()));
        }
    };
    EditorMenu = __decorate([
        mobx_preact_1.observer
    ], EditorMenu);
    exports.EditorMenu = EditorMenu;
});
//# sourceMappingURL=editor-menu.js.map