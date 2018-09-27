
import * as babylon from "babylonjs"
import {pathBreakdown} from "./path-breakdown"

export async function loadBabylonFile(
	scene,
	path: string,
	onProgress: (event: ProgressEvent) => void = event => {}
) {
	babylon.SceneLoader.ShowLoadingScreen = false
	const {dirpath, filename} = pathBreakdown(path)
	return new Promise((resolve, reject) => {
		babylon.SceneLoader.Append(
			dirpath,
			filename,
			scene,
			() => resolve(),
			onProgress,
			(scene, message) => reject(
				new Error(`Error loading babylon file: "${path}" ${message}`)
			)
		)
	})
}
