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
        define(["require", "exports", "mobx", "../../../babylon", "../../../core/entity", "../../../core/toolbox/copy", "./create-cube-mesh", "./create-cube-ghost-mesh"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx_1 = require("mobx");
    const babylon_1 = require("../../../babylon");
    const entity_1 = require("../../../core/entity");
    const copy_1 = require("../../../core/toolbox/copy");
    const create_cube_mesh_1 = require("./create-cube-mesh");
    const create_cube_ghost_mesh_1 = require("./create-cube-ghost-mesh");
    class Cube extends entity_1.Entity {
        constructor() {
            super(...arguments);
            this.last = 0;
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!Cube.assets)
                    Cube.assets = yield this.loadAssets();
                this.meshes = this.instanceAssets();
                this.establishReactions();
            });
        }
        logicTick(tickInfo) {
            if (this.isTooSoon(tickInfo.timeline, 200))
                return;
            const { position: babylonPosition, rotationQuaternion: babylonRotation } = this.meshes.mesh;
            const position = babylonPosition.asArray();
            const rotation = babylonRotation.asArray();
            this.updateState({ position, rotation });
        }
        deconstruct() {
            return __awaiter(this, void 0, void 0, function* () {
                const { mesh, ghostMesh } = yield this.meshes;
                for (const dispose of this.reactions)
                    dispose();
                mesh.dispose();
                ghostMesh.dispose();
            });
        }
        loadAssets() {
            return __awaiter(this, void 0, void 0, function* () {
                const { scene } = this.context;
                const meshBase = create_cube_mesh_1.createCubeMesh(scene);
                meshBase.isVisible = false;
                const ghostMeshBase = create_cube_ghost_mesh_1.createCubeGhostMesh(scene);
                ghostMeshBase.isVisible = false;
                return { meshBase, ghostMeshBase };
            });
        }
        instanceAssets() {
            const { entry, context, id } = this;
            const { scene } = context;
            const { size, mass, restitution, friction } = entry.physique;
            const { position } = entry.bearings;
            const { meshBase, ghostMeshBase } = Cube.assets;
            const mesh = meshBase.createInstance("cube-instance");
            mesh.scaling = babylon_1.default.Vector3.FromArray(size);
            mesh.position = babylon_1.default.Vector3.FromArray(position);
            mesh.physicsImpostor = new babylon_1.default.PhysicsImpostor(mesh, babylon_1.default.PhysicsImpostor.BoxImpostor, { mass, restitution, friction }, scene);
            mesh.physicsImpostor.physicsBody.allowSleep = true;
            mesh["entryId"] = id;
            const ghostMesh = ghostMeshBase.createInstance("cube-ghost-instance");
            ghostMesh.scaling = babylon_1.default.Vector3.FromArray(size);
            ghostMesh.position = babylon_1.default.Vector3.FromArray(position);
            ghostMesh.isPickable = false;
            return { mesh, ghostMesh };
        }
        establishReactions() {
            this.reactions = [
                mobx_1.autorun(() => {
                    if (!this.entry)
                        return;
                    const { position, rotation } = this.entry.bearings;
                    const { ghostMesh } = this.meshes;
                    ghostMesh.position = babylon_1.default.Vector3.FromArray(position);
                    ghostMesh.rotationQuaternion = babylon_1.default.Quaternion.FromArray(rotation);
                })
            ];
        }
        isTooSoon(timeline, threshold) {
            const since = timeline - this.last;
            if (since < threshold) {
                return true;
            }
            else {
                this.last = timeline;
                return false;
            }
        }
        updateState({ position, rotation }) {
            const { id } = this;
            const { network } = this.context;
            const entry = copy_1.copy(this.entry);
            entry.bearings.position = position;
            entry.bearings.rotation = rotation;
            const delay = 100;
            setTimeout(() => {
                network.send({
                    messages: [],
                    someEntries: { [id]: entry }
                });
            }, delay);
        }
    }
    exports.Cube = Cube;
});
//# sourceMappingURL=cube.js.map