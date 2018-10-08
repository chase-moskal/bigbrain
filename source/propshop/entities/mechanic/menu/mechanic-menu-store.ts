
import {observable} from "mobx"
import * as babylon from "babylonjs"

import {SceneManagerStore} from "./scene-manager-store"
import {MenuStore} from "../../../../overlay/stores/menu-store"

export class MechanicMenuStore extends MenuStore {
	readonly scene: babylon.Scene

	@observable label = "Mechanic"
	@observable sceneManager: SceneManagerStore

	constructor({scene}: {scene: babylon.Scene}) {
		super()
		this.scene = scene
		this.sceneManager = new SceneManagerStore({scene})
	}
}
