define(["require", "exports", "Susa/Loader"], function (require, exports, Loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Load objects directly into a Babylon scene.
     */
    class BabylonLoader extends Loader_1.default {
        /**
         * Create a loader that can load objects into a Babylon scene.
         */
        constructor(options) {
            super(options);
            this.scene = options.scene;
        }
        /**
         * Load an ".obj" file via a path that is relative to the page's URL.
         * Returns a promise of a loaded object report, which contains the meshes.
         * Absolute URLs are supported.
         */
        loadAsset({ path }) {
            return new Promise((resolve, reject) => {
                // Babylon wants to know the directory path separately from the file name, so we work some magic to figure those values.
                const { dirPath, fileName } = (() => {
                    let dirPath = '';
                    let fileName = '';
                    if (path.includes('/')) {
                        const parts = path.split('/');
                        fileName = parts.pop();
                        dirPath = parts.join('/') + '/';
                    }
                    else {
                        fileName = path;
                    }
                    return { dirPath, fileName };
                })();
                // Create a Babylon assets manager.
                const assetsManager = new BABYLON.AssetsManager(this.scene);
                assetsManager.useDefaultLoadingScreen = false;
                // Create a mesh task to load.
                const meshName = performance.now().toString(); // like totally w/e
                const meshTask = assetsManager.addMeshTask(meshName, null, dirPath, fileName);
                // Handler for load success (resolve the promise).
                meshTask.onSuccess = task => {
                    resolve({
                        meshes: task.loadedMeshes
                    });
                };
                // Handler for load failure (reject the promise).
                meshTask.onError = reject;
                // Start the loading process.
                assetsManager.load();
            });
        }
    }
    exports.default = BabylonLoader;
});
//# sourceMappingURL=BabylonLoader.js.map