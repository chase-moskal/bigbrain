
import {observable, action} from "mobx"
import {MenuStore} from "../../../overlay/stores/menu-store"
import {WorldObject} from "./mechanic-interfaces"

export class MechanicMenuStore extends MenuStore {
	@observable label = "Mechanic"
	@observable loaderInput: string = ""
	@observable sceneObjects: WorldObject[] = []
	@observable selectedObject: WorldObject = null

	@action setLoaderInput(value: string) {
		this.loaderInput = value
	}

	@action bogusAddSceneObjects() {
		console.log(`bogus load of "${this.loaderInput}"`)
		this.sceneObjects = [
			...this.sceneObjects,
			{
				label: "Mesh 01",
				babylonObject: {}
			},
			{
				label: "Mesh 02",
				babylonObject: {}
			},
			{
				label: "Mesh 03",
				babylonObject: {}
			}
		]
	}

	@action bogusClearAllSceneObjects() {
		this.sceneObjects = []
	}

	@action bogusRemoveSingleSceneObject(suspect) {
		this.sceneObjects = this.sceneObjects.filter(
			obj => obj !== suspect
		)
	}

	@action setSelectedObject(obj) {
		this.selectedObject = obj
	}
}
