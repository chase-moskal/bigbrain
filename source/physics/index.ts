
import {now, Service} from "../toolbox"

import Box from "./box"
import {Vector, Quaternion, Bearings, Physique} from "./data"
import {Ammo, conversionTools, vect, quat} from "./ammo-liaison"

export interface PhysicsParams {
	ammo?: typeof Ammo
	gravity?: number
}

export default class Physics implements Service {
	private readonly ammo: typeof Ammo
	private readonly world: Ammo.btDiscreteDynamicsWorld
	private active: boolean = false
	private lastStep: number = now()

	constructor({
		ammo = <typeof Ammo>window["Ammo"],
		gravity = 9.82
	}: PhysicsParams = {}) {
		this.ammo = ammo
		const config = new ammo.btDefaultCollisionConfiguration()
		const dispatcher = new ammo.btCollisionDispatcher(config)
		const broadphase = new ammo.btDbvtBroadphase()
		const solver = new ammo.btSequentialImpulseConstraintSolver()
		this.world = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, config)
		this.world.setGravity(new ammo.btVector3(0, -gravity, 0))
	}

	addBox({bearings, physique}: {bearings: Bearings; physique: Physique}) {
		const {ammo, world} = this
		return new Box({ammo, world, bearings, physique})
	}

	start() {
		this.active = true
		requestAnimationFrame(function r() {
			if (!this.active) return null
			const n = now()
			const since = n - this.lastStep
			this.lastStep = n
			this.world.stepSimulation(since, 2)
			requestAnimationFrame(r)
		})
	}

	stop() {
		this.active = false
	}

	destructor() {}
}
