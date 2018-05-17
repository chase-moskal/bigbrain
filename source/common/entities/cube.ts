
import {Scene, Mesh, Vector3, StandardMaterial, Color3, PhysicsImpostor} from "babylonjs"

import {GameContext} from "../game"
import {Entity} from "../../monarch"
import {Vector, Bearings, Physique} from "../../data"

export interface CubeEntry {
	type: "Cube"
	physique: Physique
	bearings: Bearings
}

export interface IdentifiableMesh extends Mesh {
	entryId: string
}

export const createCubeMesh = ({scene, physique, bearings, physical, entryId}: {
	scene: Scene
	physique: Physique
	bearings: Bearings
	physical: boolean
	entryId?: string
}): Mesh => {
	const material = new StandardMaterial("Cube", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)

	const mesh = <IdentifiableMesh>Mesh.CreateBox("Cube", 1, scene)
	mesh.scaling = Vector3.FromArray(physique.size)
	mesh.position = Vector3.FromArray(bearings.position)
	mesh.material = material

	if (physical) {
		const {mass, restitution} = physique
		mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, {mass, restitution}, scene)
	}

	if (entryId) mesh.entryId = entryId
	return mesh
}

export default class Cube extends Entity<GameContext, CubeEntry> {

	// babylon mesh with physics
	private readonly mesh: Mesh = createCubeMesh({
		scene: this.context.scene,
		entryId: this.id,
		physique: this.entry.physique,
		bearings: this.entry.bearings,
		physical: true
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
