
import {
	Mesh,
	Scene,
	Color3,
	Vector3,
	InstancedMesh,
	PhysicsImpostor,
	StandardMaterial,
	Quaternion as bQuaternion
} from "babylonjs"

import {autorun} from "mobx"

import {Context} from "../../game"
import {copy} from "../../toolbox"
import {Entity} from "../../entity"
import {Ticker} from "../../ticker"
import {Vector, Bearings, Physique, Quaternion} from "../../interfaces"

export interface CubeEntry {
	type: "Cube"
	physique: Physique
	bearings: Bearings
}

export const createCubeMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("cube-material", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)

	const mesh = Mesh.CreateBox("cube-mesh", 1, scene)
	mesh.material = material
	return mesh
}

export const createCubeProposalMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("cube-proposal-material", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)
	material.wireframe = true

	const mesh = Mesh.CreateBox("cube-proposal-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}

export const createCubeGhostMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("cube-ghost-material", scene)
	material.emissiveColor = new Color3(0.5, 0.5, 0.5)
	material.wireframe = true

	const mesh = Mesh.CreateBox("cube-ghost-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}

export class Cube extends Entity<Context, CubeEntry> {
	private static assets: {
		meshBase: Mesh
		ghostMeshBase: Mesh
	}

	private meshes: {
		mesh: InstancedMesh
		ghostMesh: InstancedMesh
	}

	private ticker: Ticker
	private reactions

	protected async init() {
		if (!Cube.assets) Cube.assets = await this.loadAssets()
		this.meshes = this.instanceAssets()
		this.establishLoops()
	}

	private async loadAssets() {
		const {scene} = this.context

		const meshBase = createCubeMesh(scene)
		meshBase.isVisible = false

		const ghostMeshBase = createCubeGhostMesh(scene)
		ghostMeshBase.isVisible = false

		return {meshBase, ghostMeshBase}
	}

	private instanceAssets() {
		const {entry, context, id} = this
		const {scene} = context
		const {size, mass, restitution} = entry.physique
		const {position} = entry.bearings
		const {meshBase, ghostMeshBase} = Cube.assets

		const mesh = meshBase.createInstance("cube-instance")
		mesh.scaling = Vector3.FromArray(size)
		mesh.position = Vector3.FromArray(position)
		mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, {mass, restitution}, scene)
		mesh["entryId"] = id

		const ghostMesh = ghostMeshBase.createInstance("cube-ghost-instance")
		ghostMesh.scaling = Vector3.FromArray(size)
		ghostMesh.position = Vector3.FromArray(position)
		ghostMesh.isPickable = false

		return {mesh, ghostMesh}
	}

	private establishLoops() {
		const ticker = new Ticker({
			relax: 50,
			action: tick => {
				const {
					position: babylonPosition,
					rotationQuaternion: babylonRotation
				} = this.meshes.mesh
				const position = <Vector>babylonPosition.asArray()
				const rotation = <Quaternion>babylonRotation.asArray()
				this.updateState({position, rotation})
			}
		})
		ticker.start()
		this.ticker = ticker

		this.reactions = [
			autorun(() => {
				const {position, rotation} = this.entry.bearings
				const {ghostMesh} = this.meshes
				ghostMesh.position = Vector3.FromArray(position)
				ghostMesh.rotationQuaternion = bQuaternion.FromArray(rotation)
			})
		]
	}

	private updateState({position, rotation}: {
		position: Vector
		rotation: Quaternion
	}) {
		const {id} = this
		const {network} = this.context
		const entry: CubeEntry = copy(this.entry)
		entry.bearings.position = position
		entry.bearings.rotation = rotation
		const delay = 100

		setTimeout(() => {
			network.send({
				messages: [],
				someEntries: {[id]: entry}
			})
		}, delay)
	}

	async destructor() {
		for (const dispose of this.reactions) dispose()

		const {ticker} = this
		if (ticker) ticker.destructor()

		const {mesh, ghostMesh} = await this.meshes
		for (const disposable of [mesh, ghostMesh]) disposable.dispose()
	}
}
