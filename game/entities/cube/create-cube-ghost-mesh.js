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
    exports.createCubeGhostMesh = (scene) => {
        const material = new babylon_1.default.StandardMaterial("cube-ghost-material", scene);
        material.emissiveColor = new babylon_1.default.Color3(1, 1, 1);
        material.wireframe = true;
        material.alpha = 0.1;
        const mesh = babylon_1.default.Mesh.CreateBox("cube-ghost-mesh", 1, scene);
        mesh.material = material;
        mesh.isPickable = false;
        return mesh;
    };
});
//# sourceMappingURL=create-cube-ghost-mesh.js.map