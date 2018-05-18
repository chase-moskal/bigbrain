
import {Scene, Mesh, Vector3, StandardMaterial, Color3, PhysicsImpostor, InstancedMesh} from "babylonjs"

import {GameContext} from "../game"
import {Entity} from "../../entity"
import {Vector, Bearings, Physique} from "../../interfaces"

export interface CubeEntry {
	type: "Cube"
	physique: Physique
	bearings: Bearings
}

export interface IdentifiableMesh extends Mesh {
	entryId: string
}

export const createCubeMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("Cube", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)

	const mesh = <IdentifiableMesh>Mesh.CreateBox("Cube", 1, scene)
	mesh.material = material

	return mesh
}

export const createCubeProposalMesh = (scene: Scene) => {
	const material = new StandardMaterial("Cube", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)
	material.wireframe = true

	const mesh = <IdentifiableMesh>Mesh.CreateBox("Cube", 1, scene)
	mesh.material = material
	mesh.isPickable = false

	return mesh
}

export interface CubeAssets {
	cubeMesh: Mesh
	cubeProposalMesh: Mesh
}

export class Cube extends Entity<GameContext, CubeEntry, CubeAssets> {

	static async load(context: GameContext) {
		console.log("LOAD CUBE ASSETS", Date.now())
		const {scene} = context
		const cubeMesh = createCubeMesh(scene)
		cubeMesh.isVisible = false
		return {cubeMesh}
	}

	private mesh: InstancedMesh

	init(assets: CubeAssets) {
		const {entry, context, id} = this
		const {scene} = context
		const {cubeMesh, cubeProposalMesh} = assets
		const {size, mass, restitution} = entry.physique
		const {position} = entry.bearings

		const mesh = cubeMesh.createInstance(`cube-instance`)
		mesh.scaling = Vector3.FromArray(size)
		mesh.position = Vector3.FromArray(position)
		mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, {mass, restitution}, scene)
		mesh["entryId"] = id
		this.mesh = mesh
	}

	destructor() {
		this.mesh.dispose()
	}
}
