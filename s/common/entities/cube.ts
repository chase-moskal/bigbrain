
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import {Context} from "../game"
import {Entity} from "../../monarch"

export interface CubeEntry {
	type: "Cube",
	size: number
	position: [number, number, number]
}

export interface IdentifiableMesh extends Mesh {
	entryId: string
}

export const createCubeMesh = ({scene, size, position, entryId}: {
	scene: Scene
	size: number
	position: [number, number, number]
	entryId?: string
}): Mesh => {
	const material = new StandardMaterial("Cube", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)

	const mesh = <IdentifiableMesh>Mesh.CreateBox("Cube", size, scene)
	mesh.position = Vector3.FromArray(position)
	mesh.material = material

	if (entryId) mesh.entryId = entryId
	return mesh
}

export default class Cube extends Entity<Context, CubeEntry> {

	private readonly mesh: Mesh = (() => {
		const {scene} = this.context
		const {size, position} = this.entry
		return createCubeMesh({scene, size, position, entryId: this.id})
	})()

	destructor() {
		this.mesh.dispose()
	}
}
