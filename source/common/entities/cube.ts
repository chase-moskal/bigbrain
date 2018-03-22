
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import {GameContext} from "../game"
import {Entity} from "../../monarch"
import Box from "../../physics/bodies/box"
import {Vector, Bearings, Physique} from "../../physics/data"

export interface CubeEntry {
	type: "Cube",
	physique: Physique
	bearings: Bearings
}

export interface IdentifiableMesh extends Mesh {
	entryId: string
}

export const createCubeMesh = ({scene, physique, bearings, entryId}: {
	scene: Scene
	physique: Physique
	bearings: Bearings
	entryId?: string
}): Mesh => {
	const material = new StandardMaterial("Cube", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)

	const mesh = <IdentifiableMesh>Mesh.CreateBox("Cube", 1, scene)
	mesh.scaling = Vector3.FromArray(physique.size)
	mesh.position = Vector3.FromArray(bearings.position)
	mesh.material = material

	if (entryId) mesh.entryId = entryId
	return mesh
}

export default class Cube extends Entity<GameContext, CubeEntry> {

	// mesh to represent the cube visually
	private readonly mesh: Mesh = createCubeMesh({
		scene: this.context.scene,
		entryId: this.id,
		physique: this.entry.physique,
		bearings: this.entry.bearings
	})

	// // box to simulate the cube physically
	// private readonly box: Box = this.context.physics.addBox({
	// 	physique: this.entry.physique,
	// 	bearings: this.entry.bearings
	// })

	destructor() {
		this.mesh.dispose()
		// this.box.destructor()
	}
}
