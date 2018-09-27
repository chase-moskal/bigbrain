
import * as babylon from "babylonjs"
import {observable, action} from "mobx"

import {generateId} from "../../../toolbox/generate-id"
import {MenuStore} from "../../../overlay/stores/menu-store"
import {loadBabylonMeshes} from "../../../toolbox/load-babylon-meshes"

import {WorldObject, ErrorReport} from "./mechanic-interfaces"

export class MechanicMenuStore extends MenuStore {
	readonly scene: babylon.Scene
	@observable label = "Mechanic"
	@observable loaderInput: string = ""
	@observable errors: ErrorReport[] = []
	@observable sceneObjects: WorldObject[] = []
	@observable selectedObject: WorldObject = null

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

	@action async loadBabylonObjects(): Promise<boolean> {
		const {scene, loaderInput} = this
		try {
			const {meshes} = await loadBabylonMeshes(scene, loaderInput)
			this.sceneObjects = [
				...this.sceneObjects,
				...meshes.map((mesh): WorldObject => ({
					label: mesh.id,
					babylonMesh: mesh
				}))
			]
			return true
		}
		catch (error) {
			error.message = `error loading babylon file: "${loaderInput}" ${error.message}`
			this.reportError({
				label: "load error",
				message: error.message
			})
			console.error(error)
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
