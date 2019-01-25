(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../babylon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../../babylon");
    exports.createRoundCameraRig = ({ scene, canvas, targetPosition, radius, active }) => {
        const targetVector = babylon_1.default.Vector3.FromArray(targetPosition);
        const name = "camera";
        const alpha = 0;
        const beta = 0;
        const camera = new babylon_1.default.ArcRotateCamera(name, alpha, beta, radius, targetVector, scene);
        camera.attachControl(canvas);
        if (active)
            scene.activeCamera = camera;
        return camera;
    };
});
//# sourceMappingURL=create-round-camera-rig.js.map