(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "."], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _1 = require(".");
    monarchDemo();
    function monarchDemo() {
        const game = new _1.Game({
            maxSlowTickRate: 10,
            maxLogicTickRate: 60,
            maxHyperTickRate: 1000,
            mode: _1.ModeOfConduct.Alone,
            canvas: document.querySelector("canvas"),
            overlayElement: document.querySelector(".overlay"),
            gravity: [0, -9.8, 0],
            entityClasses: {
                Cube: _1.Cube,
                Editor: _1.Editor,
                Terrain: _1.Terrain
            }
        });
        game.manager.addEntry({
            type: "Terrain"
        });
        game.manager.addEntry({
            type: "Editor",
            bearings: {
                position: [0, 10, -5],
                rotation: [0, 0, 0, 0]
            }
        });
        window.scrollTo(0, 1);
    }
    exports.monarchDemo = monarchDemo;
});
//# sourceMappingURL=monarch-demo.bundle.js.map