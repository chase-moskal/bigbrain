import Loader, { LoaderOptions, AssetReport } from 'Susa/Loader';
/**
 * Load objects directly into a Babylon scene.
 */
export default class BabylonLoader extends Loader {
    /** Babylon scene component, destination for loaded assets. */
    private readonly scene;
    /**
     * Create a loader that can load objects into a Babylon scene.
     */
    constructor(options: BabylonLoaderOptions);
    /**
     * Load an ".obj" file via a path that is relative to the page's URL.
     * Returns a promise of a loaded object report, which contains the meshes.
     * Absolute URLs are supported.
     */
    loadAsset({path}: BabylonAssetRequest): Promise<BabylonAssetReport>;
}
/**
 * Options for creating a Babylon loader.
 */
export interface BabylonLoaderOptions extends LoaderOptions {
    /** Current babylon scene to load things into. */
    scene: BABYLON.Scene;
}
/**
 * Options for loading an object.
 */
export interface BabylonAssetRequest {
    /** URL to the ".obj" file, relative from the loader's root url. */
    path: string;
}
/**
 * Report returned when an object finishes loading.
 */
export interface BabylonAssetReport extends AssetReport {
    /** Array of Babylon mesh objects. */
    meshes: BABYLON.Mesh[];
}
