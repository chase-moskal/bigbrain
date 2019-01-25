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
    exports.createCubeMesh = (scene) => {
        const material = new babylon_1.default.StandardMaterial("cube-material", scene);
        material.emissiveColor = new babylon_1.default.Color3(0.1, 0.6, 0.9);
        const mesh = babylon_1.default.Mesh.CreateBox("cube-mesh", 1, scene);
        mesh.material = material;
        return mesh;
    };
});
//# sourceMappingURL=create-cube-mesh.js.map