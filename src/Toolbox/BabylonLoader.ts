
import Loader, {LoaderOptions, AssetReport} from 'Susa/Toolbox/Loader'

/**
 * Load objects directly into a Babylon scene.
 */
export default class BabylonLoader extends Loader {

  /** Babylon scene component, destination for loaded assets. */
  private readonly scene: BABYLON.Scene

  /**
   * Create a loader that can load objects into a Babylon scene.
   */
  constructor(options: BabylonLoaderOptions) {
    super(options)
    this.scene = options.scene
  }

  /**
   * Load an ".obj" file via a path that is relative to the page's URL.
   * Returns a promise of a loaded object report, which contains the meshes.
   * Absolute URLs are supported.
   */
  loadAsset({path}: BabylonAssetRequest): Promise<BabylonAssetReport> {
    return new Promise<BabylonAssetReport>((resolve, reject) => {

      // Babylon wants to know the directory path separately from the file name, so we work some magic to figure those values.
      const {dirPath, fileName} = (() => {
        let dirPath = ''
        let fileName = ''
        if (path.includes('/')) {
          const parts = path.split('/')
          fileName = parts.pop()
          dirPath = parts.join('/') + '/'
        } else {
          fileName = path
        }
        return {dirPath, fileName}
      })()

      // Create a Babylon assets manager.
      const assetsManager = new BABYLON.AssetsManager(this.scene)
      assetsManager.useDefaultLoadingScreen = false

      // Create a mesh task to load.
      const meshName = performance.now().toString() // like totally w/e
      const meshTask = assetsManager.addMeshTask(meshName, null, dirPath, fileName)

      // Handler for load success (resolve the promise).
      meshTask.onSuccess = task => {
        resolve({
          meshes: <BABYLON.Mesh[]>(<any>task).loadedMeshes
        })
      }

      // Handler for load failure (reject the promise).
      meshTask.onError = reject

      // Start the loading process.
      assetsManager.load()
    })
  }
}

/**
 * Options for creating a Babylon loader.
 */
export interface BabylonLoaderOptions extends LoaderOptions {

  /** Current babylon scene to load things into. */
  scene: BABYLON.Scene
}

/**
 * Options for loading an object.
 */
export interface BabylonAssetRequest {

  /** URL to the ".obj" file, relative from the loader's root url. */
  path: string
}

/**
 * Report returned when an object finishes loading.
 */
export interface BabylonAssetReport extends AssetReport {

  /** Array of Babylon mesh objects. */
  meshes: BABYLON.Mesh[]
}


