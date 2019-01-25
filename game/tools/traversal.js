(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../babylon", "../../core/watcher/input", "../../core/toolbox/get-vector-magnitude"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../../babylon");
    const input_1 = require("../../core/watcher/input");
    const get_vector_magnitude_1 = require("../../core/toolbox/get-vector-magnitude");
    exports.traversiveBindings = {
        forward: [input_1.Input.W, input_1.Input.ArrowUp],
        backward: [input_1.Input.S, input_1.Input.ArrowDown],
        left: [input_1.Input.A, input_1.Input.ArrowLeft],
        right: [input_1.Input.D, input_1.Input.ArrowRight],
        raise: [input_1.Input.Space],
        lower: [input_1.Input.Z, input_1.Input.C],
        sprint: [input_1.Input.Shift]
    };
    function ascertainMovement({ watcher, stickInfo, maxSpeed = 1, timeFactor = 1, sprintFactor = 3 }) {
        let speed = maxSpeed * timeFactor;
        const control = Object.assign({}, watcher.status);
        const move = babylon_1.default.Vector3.Zero();
        // ascertain thumbstick movement
        if (stickInfo && stickInfo.force > 0) {
            const { angle, force } = stickInfo;
            const x = Math.cos(angle);
            const z = Math.sin(angle);
            const appliedForce = force < 1
                ? force
                : 1;
            move.x += x * speed * appliedForce;
            move.z += z * speed * appliedForce;
        }
        // ascertain keyboard-based movement
        else {
            if (!control.sprint)
                speed /= sprintFactor;
            if (control.forward)
                move.z += speed;
            if (control.backward)
                move.z -= speed;
            if (control.left)
                move.x -= speed;
            if (control.right)
                move.x += speed;
            if (control.raise)
                move.y += speed;
            if (control.lower)
                move.y -= speed;
        }
        if (get_vector_magnitude_1.getVectorMagnitude(move) > 1)
            move.normalize();
        return move;
    }
    exports.ascertainMovement = ascertainMovement;
    function enactMovement({ node, move }) {
        node.position = babylon_1.default.Vector3.TransformCoordinates(move, node.getWorldMatrix());
    }
    exports.enactMovement = enactMovement;
    function ascertainLook(params) {
        return babylon_1.default.Quaternion.Zero();
    }
    exports.ascertainLook = ascertainLook;
});
//# sourceMappingURL=traversal.js.map