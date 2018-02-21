
import {Vector, Quaternion, Bearings, Physique} from "./data"
import {Ammo, conversionTools, vect, quat} from "./ammo-liaison"

export interface PhysicsParams {
	ammo: Ammo
	gravity?: number
}

export default class Physics {
	private readonly ammo
	private readonly world

	constructor({ammo, gravity = 9.82}: PhysicsParams) {
		this.ammo = ammo

		const config = new ammo.btDefaultCollisionConfiguration()
		const dispatcher = new ammo.btCollisionDispatcher(config)
		const broadphase = new ammo.btDbvtBroadphase()
		const solver = new ammo.btSequentialImpulseConstraintSolver()
		this.world = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, config)

		this.world.setGravity(new ammo.btVector3(0, -gravity, 0))
	}

	async step(time: number) {
		const maxTimeSubdivisions = 2
		this.world.stepSimulation(time, maxTimeSubdivisions)
	}
}
