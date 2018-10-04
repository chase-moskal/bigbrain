
import * as preact from "preact"

import {Entity} from "../../../entity"
import {Context} from "../../../game/game-interfaces"

import {MechanicMenu} from "./mechanic-menu"
import {MechanicEntry} from "./mechanic-interfaces"
import {MechanicMenuStore} from "./mechanic-menu-store"

import {createRoundCameraRig} from "../../../toolbox/create-round-camera-rig"
import * as babylon from "babylonjs"

export class Mechanic extends Entity<Context, MechanicEntry> {

	private menu = new MechanicMenuStore({scene: this.context.scene})

	readonly camera = createRoundCameraRig({
		scene: this.context.scene,
		canvas: this.context.canvas,
		targetPosition: [0, 0, 0],
		radius: 10,
		active: true
	})

	readonly lights = (() => {
		const scene = this.context.scene
		const light1 = new babylon.HemisphericLight("light1", new babylon.Vector3(5, 5, 0), scene)
		const light2 = new babylon.PointLight("light2", new babylon.Vector3(0, 5, -5), scene)
		light1.intensity = 11
		light2.intensity = 11
		return [light1, light2]
	})()

	async init() {
		this.context.overlayStore.menuBar.addMenu(
			this.menu,
			<typeof preact.Component>MechanicMenu
		)
	}

	async destructor() {
		this.context.overlayStore.menuBar.removeMenu(this.menu)
		this.camera.dispose()
		for (const light of this.lights) light.dispose()
	}
}
