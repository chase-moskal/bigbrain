(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mobx", "../../babylon", "../../core/watcher/input", "../../core/watcher/watcher", "../entities/cube/create-cube-proposal-mesh"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mobx = require("mobx");
    const babylon_1 = require("../../babylon");
    const input_1 = require("../../core/watcher/input");
    const watcher_1 = require("../../core/watcher/watcher");
    const create_cube_proposal_mesh_1 = require("../entities/cube/create-cube-proposal-mesh");
    exports.bindings = {
        propose: [input_1.Input.E],
        place: [input_1.Input.MouseLeft],
        remove: [input_1.Input.X, input_1.Input.Backspace, input_1.Input.Delete]
    };
    class PropPlugin {
        constructor(options) {
            this.watcher = new watcher_1.Watcher({ bindings: exports.bindings });
            this.propSpawnHeight = 0.2;
            this.proposedSize = 1;
            this.proposalMesh = null;
            this.reactions = [
                // react to propose button (editor proposing prop placement)
                mobx.reaction(() => this.watcher.status.propose, propose => {
                    if (propose) {
                        if (!this.proposalMesh) {
                            const { scene } = this;
                            const { aimpoint } = this;
                            const position = (aimpoint ? aimpoint.asArray() : [0, 0, 0]);
                            const s = this.proposedSize = this.getRandomSize();
                            const physique = {
                                mass: s,
                                size: [s, s, s]
                            };
                            const bearings = {
                                position,
                                rotation: [0, 0, 0, 0]
                            };
                            const mesh = create_cube_proposal_mesh_1.createCubeProposalMesh(scene);
                            mesh.scaling = babylon_1.default.Vector3.FromArray(physique.size);
                            mesh.position = babylon_1.default.Vector3.FromArray(bearings.position);
                            mesh.position.y += this.proposedSize + this.propSpawnHeight;
                            this.proposalMesh = mesh;
                        }
                    }
                    else {
                        if (this.proposalMesh) {
                            this.proposalMesh.dispose();
                            this.proposalMesh = null;
                        }
                    }
                }),
                // react to placement button
                mobx.reaction(() => this.watcher.status.place, place => {
                    const { manager, proposalMesh } = this;
                    if (place && proposalMesh) {
                        const s = this.proposedSize;
                        manager.addEntry({
                            type: "Cube",
                            physique: {
                                mass: s,
                                size: [s, s, s],
                                friction: 1
                            },
                            bearings: {
                                position: proposalMesh.position.asArray(),
                                rotation: proposalMesh.rotation.asArray()
                            }
                        });
                    }
                }),
                // react to removal button
                mobx.reaction(() => this.watcher.status.remove, remove => {
                    const { manager } = this;
                    if (remove) {
                        const pick = this.middlePick();
                        if (pick && pick.pickedMesh) {
                            const mesh = pick.pickedMesh;
                            if (mesh["entryId"])
                                manager.removeEntry(mesh["entryId"]);
                        }
                    }
                })
            ];
            this.manager = options.manager;
            this.scene = options.scene;
            this.canvas = options.canvas;
        }
        get aimpoint() {
            const { scene, canvas } = this;
            const { pickedPoint: aimpoint } = scene.pick(canvas.width / 2, canvas.height / 2);
            return aimpoint;
        }
        logic(tick) {
            const { aimpoint, proposalMesh } = this;
            if (aimpoint)
                aimpoint.y += this.proposedSize + this.propSpawnHeight;
            if (proposalMesh)
                proposalMesh.position = aimpoint || babylon_1.default.Vector3.Zero();
        }
        destructor() {
            this.watcher.destructor();
            for (const dispose of this.reactions)
                dispose();
        }
        middlePick() {
            const { scene, canvas } = this;
            return scene.pick(canvas.width / 2, canvas.height / 2);
        }
        getRandomSize() {
            return 0.1 + (Math.random() * 1.5);
        }
    }
    exports.PropPlugin = PropPlugin;
});
//# sourceMappingURL=prop-plugin.js.map