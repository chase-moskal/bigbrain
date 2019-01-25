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
    exports.makeCamera = ({ scene, bearings, speed }) => {
        const camera = new babylon_1.default.FreeCamera("Spectator Camera", babylon_1.default.Vector3.FromArray(bearings.position), scene);
        camera.position = babylon_1.default.Vector3.FromArray(bearings.position);
        camera.setTarget(babylon_1.default.Vector3.Zero());
        camera.speed = speed;
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        if (!camera._localDirection)
            camera._localDirection = babylon_1.default.Vector3.Zero();
        if (!camera._transformedDirection)
            camera._transformedDirection = babylon_1.default.Vector3.Zero();
        scene.activeCamera = camera;
        return camera;
    };
    function makeBasicCamera({ scene, bearings }) {
        const camera = new babylon_1.default.TargetCamera("basic-camera", babylon_1.default.Vector3.FromArray(bearings.position), scene);
        scene.activeCamera = camera;
        return camera;
    }
    exports.makeBasicCamera = makeBasicCamera;
    exports.makeActiveCamera = ({ scene, position, speed }) => {
        const camera = new babylon_1.default.FreeCamera("camera", babylon_1.default.Vector3.FromArray(position), scene);
        camera.position = babylon_1.default.Vector3.FromArray(position);
        camera.setTarget(babylon_1.default.Vector3.Zero());
        camera.speed = speed;
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        if (!camera._localDirection)
            camera._localDirection = babylon_1.default.Vector3.Zero();
        if (!camera._transformedDirection)
            camera._transformedDirection = babylon_1.default.Vector3.Zero();
        scene.activeCamera = camera;
        return camera;
    };
});
//# sourceMappingURL=camtools.js.map