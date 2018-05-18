
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

export const createCubeMesh = ({proposal, scene, physique, bearings, entryId}: {
	proposal: boolean
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

	if (proposal) {
		mesh.material.wireframe = true
		mesh.isPickable = false
	}
	else {
		const {mass, restitution} = physique
		mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, {mass, restitution}, scene)
	}

	if (entryId) mesh.entryId = entryId
	return mesh
}

export default class Cube extends Entity<GameContext, CubeEntry> {

	// babylon mesh with physics
	private readonly mesh: Mesh = createCubeMesh({
		proposal: false,
		scene: this.context.scene,
		physique: this.entry.physique,
		bearings: this.entry.bearings,
		entryId: this.id
	})

	destructor() {
		this.mesh.dispose()
	}
}
