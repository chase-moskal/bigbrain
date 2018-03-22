
import {now, Service} from "../toolbox"

import Box from "./bodies/box"
import {Vector, Quaternion, Bearings, Physique} from "./data"
import {Ammo, conversionTools, vect, quat} from "./ammo-liaison"

export interface PhysicsParams {
	gravity?: Vector
}

export default class Physics implements Service {
	private readonly ammo: typeof Ammo
	private readonly world: Ammo.btDiscreteDynamicsWorld
	// private active: boolean = false
	// private lastStep: number = now()

	constructor({
		gravity = [0, -9.82, 0]
	}: PhysicsParams = {}) {
		// if (!ammo) throw new Error("'ammo.js' not loaded for physics")
		// this.ammo = ammo
		// const {bvect, bquat} = conversionTools(ammo)
		// const config = new ammo.btDefaultCollisionConfiguration()
		// const dispatcher = new ammo.btCollisionDispatcher(config)
		// const broadphase = new ammo.btDbvtBroadphase()
		// const solver = new ammo.btSequentialImpulseConstraintSolver()
		// this.world = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, config)
		// this.world.setGravity(bvect(gravity))
	}

	addBox({bearings, physique}: {bearings: Bearings; physique: Physique}): Box {
		const {ammo, world} = this
		return new Box({ammo, world, bearings, physique})
	}

	start() {
		// this.active = true
		// const that = this
		// requestAnimationFrame(function r() {
		// 	if (!that.active) return null
		// 	const n = now()
		// 	const since = n - that.lastStep
		// 	that.lastStep = n
		// 	that.world.stepSimulation(since, 2)
		// 	requestAnimationFrame(r)
		// })
	}

	stop() {
		// this.active = false
	}

	destructor() {}
}
