var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../babylon", "../../core/entity"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../../babylon");
    const entity_1 = require("../../core/entity");
    class Ground extends entity_1.Entity {
        constructor(o) {
            super(o);
            const { scene } = this.context;
            this.loadGround(scene);
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        loadGround(scene) {
            return __awaiter(this, void 0, void 0, function* () {
                const light1 = new babylon_1.default.HemisphericLight("light1", new babylon_1.default.Vector3(5, 5, 0), scene);
                const light2 = new babylon_1.default.PointLight("light2", new babylon_1.default.Vector3(0, 5, -5), scene);
                light1.intensity = 0.4;
                light2.intensity = 0.4;
                const mesh = babylon_1.default.MeshBuilder.CreateGround("ground", { width: 50, height: 50, subdivisions: 2 }, scene);
                mesh.physicsImpostor = new babylon_1.default.PhysicsImpostor(mesh, babylon_1.default.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, scene);
                mesh.translate(new babylon_1.default.Vector3(0, -1, 0), 10);
            });
        }
        deconstruct() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    }
    exports.Ground = Ground;
});
//# sourceMappingURL=ground.js.map