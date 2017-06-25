import Logger from 'Susa/Logger';
/**
 * Base class.
 * Loads scenes and objects.
 */
declare abstract class Loader {
    /** Logging utility. */
    protected readonly logger: Logger;
    /**
     * Construct a new loader with options.
     */
    constructor(options: LoaderOptions);
    /**
     * Load an individual asset.
     */
    abstract loadAsset(request: AssetRequest): AssetReport;
}
export default Loader;
/**
 * Input for creating a loader.
 */
export interface LoaderOptions {
    logger: Logger;
}
/**
 * Describe an asset to be loaded.
 */
export interface AssetRequest {
    path: string;
}
/**
 * Report the details of a loaded asset.
 */
export interface AssetReport {
}
