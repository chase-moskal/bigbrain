
import * as babylon from "babylonjs"
import {observable, action} from "mobx"

import {generateId} from "../../../toolbox/generate-id"
import {MenuStore} from "../../../overlay/stores/menu-store"
import {loadBabylonAssets} from "../../../toolbox/load-babylon-assets"

import {WorldObject, ErrorReport} from "./mechanic-interfaces"

export class MechanicMenuStore extends MenuStore {
	readonly scene: babylon.Scene
	@observable label = "Mechanic"
	@observable loaderInput: string = ""
	@observable errors: ErrorReport[] = []
	@observable sceneObjects: WorldObject[] = []
	@observable selectedObject: WorldObject = null
	@observable loading: boolean = false
	@observable loaderProgress: number = null

	constructor({scene}: {scene: babylon.Scene}) {
		super()
		this.scene = scene
	}

	@action setLoaderInput(value: string) {
		this.loaderInput = value
	}

	@action reportError(report: ErrorReport) {
		const id = generateId()

		// add the error
		this.errors.push({id, ...report})

		// remove the error
		setTimeout(() => {
			this.errors = this.errors.filter(r => r.id !== id)
		}, 5000)
	}

	@action setLoaderProgress(value: number) {
		this.loaderProgress = value
	}

	@action async loadBabylonObjects(): Promise<boolean> {
		const {scene, loaderInput} = this
		this.loading = true
		try {
			if (!loaderInput) throw new Error(`empty path is not valid`)
			const assetContainer = await loadBabylonAssets({
				scene,
				path: loaderInput,
				onProgress: event => {
					const value = event.lengthComputable
						? (event.loaded / event.total) * 100
						: null
					this.setLoaderProgress(value)
				}
			})
			assetContainer.addAllToScene()
			this.sceneObjects = [
				...this.sceneObjects,
				...assetContainer.meshes.map((mesh): WorldObject => ({
					label: mesh.id,
					babylonMesh: mesh
				}))
			]
			this.loading = false
			this.loaderProgress = null
			return true
		}
		catch (error) {
			error.message = `error loading "${loaderInput}": ${error.message}`
			this.reportError({
				label: "load error",
				message: error.message
			})
			console.error(error)
			this.loading = false
			this.loaderProgress = null
			return false
		}
	}

	@action clearAllSceneObjects() {
		for (const {babylonMesh} of this.sceneObjects)
			babylonMesh.dispose()
		this.sceneObjects = []
	}

	@action removeSingleSceneObject(suspect: WorldObject) {
		suspect.babylonMesh.dispose()
		this.sceneObjects = this.sceneObjects.filter(
			obj => obj !== suspect
		)
	}

	@action setSelectedObject(obj) {
		this.selectedObject = obj
	}
}
