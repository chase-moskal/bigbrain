(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../babylon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../../../babylon");
    function createLaserDot({ scene }) {
        const material = new babylon_1.default.StandardMaterial("laser-dot-mat", scene);
        const red = new babylon_1.default.Color3(255, 0, 0);
        material.alpha = 0.5;
        material.emissiveColor
            = material.diffuseColor
                = material.ambientColor
                    = material.specularColor
                        = red;
        const mesh = babylon_1.default.Mesh.CreateIcoSphere("laser-dot", {
            radius: 0.1,
            flat: false,
            subdivisions: 2
        }, scene);
        mesh.material = material;
        mesh.isPickable = false;
        return mesh;
    }
    exports.createLaserDot = createLaserDot;
});
//# sourceMappingURL=create-laser-dot.js.map