
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import Box from "../../physics/box"
import {Entity} from "../../monarch"
import {Vector, Bearings, Physique} from "../../physics/data"

import {GameContext} from "../game"

export interface CubeEntry {
	type: "Cube",
	size: number
	position: Vector
}

export interface IdentifiableMesh extends Mesh {
	entryId: string
}

export const createCubeMesh = ({scene, size, position, entryId}: {
	scene: Scene
	size: number
	position: Vector
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

export default class Cube extends Entity<GameContext, CubeEntry> {

	private readonly mesh: Mesh = (() => {
		const {scene} = this.context
		const {size, position} = this.entry
		return createCubeMesh({scene, size, position, entryId: this.id})
	})()

	private readonly box: Box = (() => {
		const {physics} = this.context
		const {size, position} = this.entry
		return physics.addBox({
			bearings: {
				position,
				rotation: [0, 0, 0, 0]
			},
			physique: {
				mass: 1,
				size: [size, size, size]
			}
		})
	})()

	destructor() {
		this.mesh.dispose()
		this.box.destructor()
	}
}
