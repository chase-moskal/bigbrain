
import {autorun, IReactionDisposer} from "mobx"

import babylon from "../../../babylon"

import {Entity} from "../../../core/entity"
import {Context} from "../../game-interfaces"
import {copy} from "../../../core/toolbox/copy"
import {Vector, Quaternion, TickInfo} from "../../../core/interfaces"

import {CubeEntry} from "./cube-interfaces"
import {createCubeMesh} from "./create-cube-mesh"
import {createCubeGhostMesh} from "./create-cube-ghost-mesh"

export class Cube extends Entity<Context, CubeEntry> {
	private static assets: {
		meshBase: babylon.Mesh
		ghostMeshBase: babylon.Mesh
	}

	private reactions: IReactionDisposer[]
	private meshes: {
		mesh: babylon.InstancedMesh
		ghostMesh: babylon.InstancedMesh
	}

	async initialize() {
		if (!Cube.assets) Cube.assets = await this.loadAssets()
		this.meshes = this.instanceAssets()
		this.establishReactions()
	}

	logicTick(tickInfo: TickInfo) {
		if (this.isTooSoon(tickInfo.timeline, 200)) return
		const {
			position: babylonPosition,
			rotationQuaternion: babylonRotation
		} = this.meshes.mesh
		const position = <Vector>babylonPosition.asArray()
		const rotation = <Quaternion>babylonRotation.asArray()
		this.updateState({position, rotation})
	}

	async deconstruct() {
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
		const {size, mass, restitution, friction} = entry.physique
		const {position} = entry.bearings
		const {meshBase, ghostMeshBase} = Cube.assets

		const mesh = meshBase.createInstance("cube-instance")
		mesh.scaling = babylon.Vector3.FromArray(size)
		mesh.position = babylon.Vector3.FromArray(position)
		mesh.physicsImpostor = new babylon.PhysicsImpostor(
			mesh,
			babylon.PhysicsImpostor.BoxImpostor,
			{mass, restitution, friction},
			scene
		)
		mesh.physicsImpostor.physicsBody.allowSleep = true
		mesh["entryId"] = id

		const ghostMesh = ghostMeshBase.createInstance("cube-ghost-instance")
		ghostMesh.scaling = babylon.Vector3.FromArray(size)
		ghostMesh.position = babylon.Vector3.FromArray(position)
		ghostMesh.isPickable = false

		return {mesh, ghostMesh}
	}

	private establishReactions() {
		this.reactions = [
			autorun(() => {
				if (!this.entry) return
				const {position, rotation} = this.entry.bearings
				const {ghostMesh} = this.meshes
				ghostMesh.position = babylon.Vector3.FromArray(position)
				ghostMesh.rotationQuaternion = babylon.Quaternion.FromArray(rotation)
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
