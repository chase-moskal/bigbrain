
import * as babylon from "babylonjs"

export async function loadBabylonAssets({
	path,
	scene,
	onProgress = event => {}
}: {
	path: string
	scene: babylon.Scene
	onProgress: (event: babylon.SceneLoaderProgressEvent) => void
}): Promise<babylon.AssetContainer> {

	babylon.SceneLoader.ShowLoadingScreen = false
	return babylon.SceneLoader.LoadAssetContainerAsync(
		path,
		null,
		scene,
		onProgress
	)
}
