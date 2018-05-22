
import {reaction} from "mobx"
import {
	Mesh,
	Scene,
	Color3,
	Vector3,
	InstancedMesh,
	PhysicsImpostor,
	StandardMaterial
} from "babylonjs"
import {Vec3, RaycastVehicle, RigidVehicle, WheelInfo, IWheelInfoOptions} from "cannon"

import {Context} from "../game"
import {Entity} from "../../entity"
import {Watcher, Input} from "../../watcher"
import {loadBabylonMeshes} from "../../toolbox"
import {Vector, Bearings} from "../../interfaces"
import {makeActiveCamera, createRoundCameraRig} from "../tools/camtools"

import {Editor} from "./editor"

export interface AgentEntry {
	type: "Agent"
	player: boolean
	bearings: Bearings
}

export interface AgentAssets {
	allMeshes: Mesh[]
	tankBodyBase: Mesh
	tankPhysicsBodyBase: Mesh
	tankTurretBase: Mesh
	tankCannonBase: Mesh
	tankWheelBase: Mesh
	tankGasBase: Mesh
}

export interface TankMeshes {
	tankBody: InstancedMesh
	tankPhysicsBody: InstancedMesh
	tankTurret: InstancedMesh
	tankCannon: InstancedMesh
	tankGas: InstancedMesh
	tankWheel1: InstancedMesh
	tankWheel2: InstancedMesh
	tankWheel3: InstancedMesh
	tankWheel4: InstancedMesh
	tankWheel5: InstancedMesh
	tankWheel6: InstancedMesh
}

export class Agent extends Entity<Context, AgentEntry> {

	private static assets: AgentAssets

	private meshes: Promise<TankMeshes> = (async () => {
		if (!Agent.assets) Agent.assets = await this.loadAssets()
		const meshes = await this.instanceAssets()
		this.setupVehiclePhysics(meshes)
		return meshes
	})()

	private async loadAssets() {
		const {scene} = this.context
		const meshes = <Mesh[]>(await loadBabylonMeshes(scene, "assets/tank.babylon")).meshes
		for (const mesh of meshes) {
			mesh.isVisible = false
			mesh.convertToFlatShadedMesh()
		}
		return {
			allMeshes: meshes,
			tankBodyBase: meshes.find(mesh => mesh.name === "tankbody"),
			tankPhysicsBodyBase: meshes.find(mesh => mesh.name === "tank-physics-body"),
			tankTurretBase: meshes.find(mesh => mesh.name === "tankturret"),
			tankCannonBase: meshes.find(mesh => mesh.name === "tankcannon"),
			tankGasBase: meshes.find(mesh => mesh.name === "gastank"),
			tankWheelBase: meshes.find(mesh => mesh.name === "wheel-1")
		}
	}

	private async instanceAssets() {
		const {entry, context, id} = this
		const {scene} = context
		const {position, rotation} = entry.bearings
		const {assets} = Agent

		const meshes = {
			tankBody: assets.tankBodyBase.createInstance("tank-body-instance"),
			tankPhysicsBody: assets.tankPhysicsBodyBase.createInstance("tank-physics-body-instance"),
			tankTurret: assets.tankTurretBase.createInstance("tank-turret-instance"),
			tankCannon: assets.tankCannonBase.createInstance("tank-cannon-instance"),
			tankGas: assets.tankGasBase.createInstance("tank-gas-instance"),
			tankWheel1: assets.tankWheelBase.createInstance("tank-wheel-instance-1"),
			tankWheel2: assets.tankWheelBase.createInstance("tank-wheel-instance-2"),
			tankWheel3: assets.tankWheelBase.createInstance("tank-wheel-instance-3"),
			tankWheel4: assets.tankWheelBase.createInstance("tank-wheel-instance-4"),
			tankWheel5: assets.tankWheelBase.createInstance("tank-wheel-instance-5"),
			tankWheel6: assets.tankWheelBase.createInstance("tank-wheel-instance-6")
		}

		return meshes
	}

	private async setupVehiclePhysics(meshes: TankMeshes) {
		const {
			tankBody,
			tankPhysicsBody,
			tankTurret,
			tankCannon,
			tankGas,
			tankWheel1,
			tankWheel2,
			tankWheel3,
			tankWheel4,
			tankWheel5,
			tankWheel6
		} = meshes

		// prepare the physics body
		tankPhysicsBody.isVisible = false
		tankPhysicsBody.physicsImpostor = new PhysicsImpostor(tankPhysicsBody, PhysicsImpostor.BoxImpostor, {mass: 10})

		// parent tank parts to the physics body
		for (const m of [
			tankBody,
			tankTurret,
			tankCannon,
			tankGas,
			tankWheel1,
			tankWheel2,
			tankWheel3,
			tankWheel4,
			tankWheel5,
			tankWheel6
		]) {
			const p = m.getAbsolutePosition()
			m.parent = tankPhysicsBody
			m.setAbsolutePosition(p)
		}

		// vehicle simulation
		const vehicle = new RaycastVehicle({
			chassisBody: tankPhysicsBody.physicsImpostor.physicsBody
		})

		const {scene, physicsWorld} = this.context

		const wheelInfo: IWheelInfoOptions = {
			radius: 0.5,
			directionLocal: new Vec3(0, 0, -1),
			suspensionStiffness: 30,
			suspensionRestLength: 1,
			frictionSlip: 5,
			dampingRelaxation: 2.3,
			dampingCompression: 4.4,
			maxSuspensionForce: 100000,
			rollInfluence: 0.01,
			axleLocal: new Vec3(0, 1, 0),
			maxSuspensionTravel: 2,
			customSlidingRotationalSpeed: -30,
			useCustomSlidingRotationalSpeed: true,
			chassisConnectionPointLocal: new Vec3(1, 1, 0)
		}

		// add wheels
		vehicle.addWheel({...wheelInfo, chassisConnectionPointLocal: new Vec3(1, 1, 0)})
		vehicle.addWheel({...wheelInfo, chassisConnectionPointLocal: new Vec3(1, -1, 0)})
		vehicle.addWheel({...wheelInfo, chassisConnectionPointLocal: new Vec3(-1, 1, 0)})
		vehicle.addWheel({...wheelInfo, chassisConnectionPointLocal: new Vec3(-1, -1, 0)})

		// finalize vehicle
		vehicle.addToWorld(physicsWorld)

		// parent camera to the physics body
		this.camera.parent = tankPhysicsBody
	}

	private readonly watcher = new Watcher({
		eventTarget: this.context.window,
		bindings: {
			suicide: [Input.R]
		}
	})

	private readonly camera = createRoundCameraRig({
		scene: this.context.scene,
		canvas: this.context.canvas,
		targetPosition: this.entry.bearings.position,
		radius: 10,
		active: true
	})

	private readonly reactions = [
		reaction(() => this.watcher.status.suicide, suicide => {
			if (suicide) {
				console.log("agent suicide", this.id)
				this.context.manager.removeEntry(this.id)
			}
		})
	]

	private readonly greeting = (() => {
		console.log("agent spawn", this.id)
		return true
	})()

	readonly player = this.entry.player

	async destructor() {
		for (const dispose of this.reactions) dispose()

		const editor = <Editor>this.context.manager.getEntities().find(entity => entity instanceof Editor)
		this.context.scene.activeCamera = editor.camera

		this.camera.dispose()

		const meshes = await this.meshes
		for (const meshName of Object.keys(meshes)) {
			const mesh = meshes[meshName]
			mesh.dispose()
		}
	}
}
