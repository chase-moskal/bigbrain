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
        define(["require", "exports", "simplex-noise", "../../babylon", "../../core/entity", "../../core/toolbox/load-babylon-assets"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SimplexNoise = require("simplex-noise");
    const babylon_1 = require("../../babylon");
    const entity_1 = require("../../core/entity");
    const load_babylon_assets_1 = require("../../core/toolbox/load-babylon-assets");
    class Terrain extends entity_1.Entity {
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.load(this.context.scene);
            });
        }
        deconstruct() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        load(scene) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.generateLighting(scene);
                yield this.generateTerrain(scene);
                // await this.loadTerrainObjectFile(scene)
            });
        }
        generateLighting(scene) {
            return __awaiter(this, void 0, void 0, function* () {
                const light1 = new babylon_1.default.HemisphericLight("light1", new babylon_1.default.Vector3(5, 5, 0), scene);
                const light2 = new babylon_1.default.PointLight("light2", new babylon_1.default.Vector3(0, 5, -5), scene);
                light1.intensity = 0.4;
                light2.intensity = 0.7;
            });
        }
        generateTerrain(scene) {
            return __awaiter(this, void 0, void 0, function* () {
                const simplexNoise = new SimplexNoise();
                function updateVertices(mesh, vertexHandler) {
                    mesh.updateMeshPositions(vertexData => {
                        for (let index = 0; index < vertexData.length; index += 3) {
                            const vertex = [
                                vertexData[index],
                                vertexData[index + 1],
                                vertexData[index + 2]
                            ];
                            const [x, y, z] = vertexHandler(vertex);
                            vertexData[index] = x;
                            vertexData[index + 1] = y;
                            vertexData[index + 2] = z;
                        }
                    });
                }
                function applyNoise({ mesh, scale, magnitude }) {
                    updateVertices(mesh, ([x, y, z]) => ([
                        x,
                        y + (simplexNoise.noise2D(x / scale, z / scale) * magnitude) - (magnitude / 2),
                        z
                    ]));
                }
                function createTerrain({ size, subdivisions, scene, meshName = "terrain-" + Math.floor(Math.random() * 1000), }) {
                    const terrainMeshPhysical = babylon_1.default.Mesh.CreateGround(meshName, size, size, subdivisions, scene, true);
                    terrainMeshPhysical.isVisible = false;
                    const terrainMeshVisual = babylon_1.default.Mesh.CreateGround(meshName, size, size, subdivisions * 4, scene, true);
                    terrainMeshVisual.isVisible = true;
                    terrainMeshVisual.material = new babylon_1.default.StandardMaterial("terrainmaterial", scene);
                    terrainMeshVisual.material.wireframe = true;
                    const broadNoisePasses = [
                        { scale: 20, magnitude: 2 },
                        { scale: 5, magnitude: 0.2 },
                        { scale: 0.5, magnitude: 0.02 }
                    ];
                    for (const noiseOptions of broadNoisePasses) {
                        applyNoise(Object.assign({ mesh: terrainMeshPhysical }, noiseOptions));
                        applyNoise(Object.assign({ mesh: terrainMeshVisual }, noiseOptions));
                    }
                    const subtleNoisePasses = [
                        { scale: 0.3, magnitude: 0.02 },
                        { scale: 0.1, magnitude: 0.01 }
                    ];
                    for (const noiseOptions of subtleNoisePasses) {
                        applyNoise(Object.assign({ mesh: terrainMeshPhysical }, noiseOptions));
                        applyNoise(Object.assign({ mesh: terrainMeshVisual }, noiseOptions));
                    }
                    terrainMeshVisual.physicsImpostor = new babylon_1.default.PhysicsImpostor(terrainMeshPhysical, babylon_1.default.PhysicsImpostor.MeshImpostor, {
                        mass: 0,
                        restitution: 0.1,
                        friction: 1
                    });
                    return { terrainMeshPhysical, terrainMeshVisual };
                }
                createTerrain({
                    size: 100,
                    subdivisions: 50,
                    scene
                });
            });
        }
        loadTerrainObjectFile(scene) {
            return __awaiter(this, void 0, void 0, function* () {
                const container = yield load_babylon_assets_1.loadBabylonAssets({
                    path: "assets/testterrains.obj",
                    scene,
                    onProgress: () => { }
                });
                const lowPolyMesh = container.meshes.find(mesh => mesh.name.includes("7.5k"));
                const highPolyMesh = container.meshes.find(mesh => mesh.name.includes("131k"));
                for (const mesh of container.meshes) {
                    mesh.isVisible = false;
                }
                for (const mesh of [lowPolyMesh, highPolyMesh])
                    mesh.scaling = new babylon_1.default.Vector3(10, 10, 10);
                highPolyMesh.physicsImpostor = new babylon_1.default.PhysicsImpostor(lowPolyMesh, babylon_1.default.PhysicsImpostor.MeshImpostor, {
                    mass: 0,
                    restitution: 0.1,
                    friction: 0.5
                });
                highPolyMesh.isVisible = true;
                container.addAllToScene();
            });
        }
    }
    exports.Terrain = Terrain;
});
//# sourceMappingURL=terrain.js.map