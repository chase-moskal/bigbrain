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
    exports.createCubeProposalMesh = (scene) => {
        const material = new babylon_1.default.StandardMaterial("cube-proposal-material", scene);
        const color = new babylon_1.default.Color3(0.4, 0.8, 1);
        material.alpha = 0.75;
        material.wireframe = true;
        material.emissiveColor
            = material.diffuseColor
                = material.ambientColor
                    = material.specularColor
                        = color;
        const mesh = babylon_1.default.Mesh.CreateBox("cube-proposal-mesh", 1, scene);
        mesh.material = material;
        mesh.isPickable = false;
        return mesh;
    };
});
//# sourceMappingURL=create-cube-proposal-mesh.js.map