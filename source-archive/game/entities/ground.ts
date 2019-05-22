
import {Context} from "../game-interfaces.js"

import * as babylon from "@babylonjs/core"
import {Entity} from "../../core/entity.js"
import {StateEntry, TickInfo} from "../../core/interfaces.js"

export interface GroundEntry extends StateEntry {
	type: "Ground"
}

export class Ground extends Entity<Context, GroundEntry> {
	constructor(o) {
		super(o)
		const {scene} = this.context
		this.loadGround(scene)
	}

	async initialize() {}

	private async loadGround(scene: babylon.Scene) {
		const light1 = new babylon.HemisphericLight("light1", new babylon.Vector3(5, 5, 0), scene)
		const light2 = new babylon.PointLight("light2", new babylon.Vector3(0, 5, -5), scene)
		light1.intensity = 0.4
		light2.intensity = 0.4

		const mesh = babylon.MeshBuilder.CreateGround("ground", {width: 50, height: 50, subdivisions: 2}, scene)
		mesh.physicsImpostor = new babylon.PhysicsImpostor(mesh, babylon.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.1}, scene)
		mesh.translate(new babylon.Vector3(0, -1, 0), 10)
	}

	async deconstruct() {}
}
