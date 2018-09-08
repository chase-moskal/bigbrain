
import {
	Mesh,
	Vector3,
	InstancedMesh,
	PhysicsImpostor,
	Quaternion as bQuaternion
} from "babylonjs"
import {autorun, IReactionDisposer} from "mobx"

import {Entity} from "../../../entity"
import {copy} from "../../../toolbox/copy"
import {Context} from "../../game-interfaces"
import {Vector, Quaternion, TickInfo} from "../../../interfaces"

import {CubeEntry} from "./cube-interfaces"
import {createCubeMesh} from "./create-cube-mesh"
import {createCubeGhostMesh} from "./create-cube-ghost-mesh"

export class Cube extends Entity<Context, CubeEntry> {
	private static assets: {
		meshBase: Mesh
		ghostMeshBase: Mesh
	}

	private reactions: IReactionDisposer[]
	private meshes: {
		mesh: InstancedMesh
		ghostMesh: InstancedMesh
	}

	async init() {
		if (!Cube.assets) Cube.assets = await this.loadAssets()
		this.meshes = this.instanceAssets()
		this.establishReactions()
	}

	logic(tick: TickInfo) {
		if (this.isTooSoon(tick.timeline, 200)) return
		const {
			position: babylonPosition,
			rotationQuaternion: babylonRotation
		} = this.meshes.mesh
		const position = <Vector>babylonPosition.asArray()
		const rotation = <Quaternion>babylonRotation.asArray()
		this.updateState({position, rotation})
	}

	async destructor() {
		const {mesh, ghostMesh} = await this.meshes
		for (const dispose of this.reactions) dispose()
		mesh.dispose()
		ghostMesh.dispose()
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
		mesh.physicsImpostor = new PhysicsImpostor(
			mesh,
			PhysicsImpostor.BoxImpostor,
			{mass, restitution},
			scene
		)
		mesh.physicsImpostor.physicsBody.allowSleep = true
		mesh["entryId"] = id

		const ghostMesh = ghostMeshBase.createInstance("cube-ghost-instance")
		ghostMesh.scaling = Vector3.FromArray(size)
		ghostMesh.position = Vector3.FromArray(position)
		ghostMesh.isPickable = false

		return {mesh, ghostMesh}
	}

	private establishReactions() {
		this.reactions = [
			autorun(() => {
				if (!this.entry) return
				const {position, rotation} = this.entry.bearings
				const {ghostMesh} = this.meshes
				ghostMesh.position = Vector3.FromArray(position)
				ghostMesh.rotationQuaternion = bQuaternion.FromArray(rotation)
			})
		]
	}

	private last = 0
	private isTooSoon(timeline: number, threshold: number): boolean {
		const since = timeline - this.last
		if (since < threshold) {
			return true
		}
		else {
			this.last = timeline
			return false
		}
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
}
