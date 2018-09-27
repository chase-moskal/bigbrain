
import * as babylon from "babylonjs"
import {pathBreakdown} from "./path-breakdown"

export async function loadBabylonMeshes(
	scene: babylon.Scene,
	path: string,
	onProgress: (event: babylon.SceneLoaderProgressEvent) => void = event => {}
) {
	babylon.SceneLoader.ShowLoadingScreen = false
	const meshNames = ""
	// const {dirpath, filename} = pathBreakdown(path)
	return babylon.SceneLoader.ImportMeshAsync(
		meshNames,
		path,
		null,
		scene,
		onProgress
	)
}
