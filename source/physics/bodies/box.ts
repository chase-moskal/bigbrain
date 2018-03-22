
import {Bearings, Physique, Vector, Quaternion} from "../data"
import {Ammo, conversionTools, vect, quat} from "../ammo-liaison"

export interface BoxParams {
	ammo: typeof Ammo
	world: Ammo.btDiscreteDynamicsWorld
	bearings: Bearings
	physique: Physique
}

export interface Body {
	readonly bearings: Bearings
	readonly physique: Physique
}

export default class Box implements Body {
	private readonly ammo: typeof Ammo
	private readonly world: Ammo.btDiscreteDynamicsWorld
	private readonly rigidBody: Ammo.btRigidBody
	private readonly transformAux: Ammo.btTransform

	readonly physique: Physique

	get bearings(): Bearings {
		const state = this.rigidBody.getMotionState()
		if (state) {
			const {transformAux} = this
			state.getWorldTransform(transformAux)
			return {
				position: vect(transformAux.getOrigin()),
				rotation: quat(transformAux.getRotation())
			}
		}
	}

	constructor({ammo, world, bearings, physique}: BoxParams) {
		const {position, rotation} = bearings
		const {mass, size, friction} = physique
		const {bvect, bquat} = conversionTools(ammo)

		this.ammo = ammo
		this.world = world
		this.physique = physique

		this.transformAux = new ammo.btTransform()
		const transform = new ammo.btTransform()
		transform.setIdentity()
		transform.setOrigin(bvect(position))
		transform.setRotation(bquat(rotation))
		const motionState = new ammo.btDefaultMotionState(transform)
		const localInertia = new ammo.btVector3(0, 0, 0)
		const geometry = new ammo.btBoxShape(bvect(size))
		geometry.calculateLocalInertia(mass, localInertia)

		const bodyInfo = new ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia)
		this.rigidBody = new ammo.btRigidBody(bodyInfo)

		this.rigidBody.setFriction(friction)
		this.rigidBody.setActivationState(ammo.ActivationState.DisableDeactivation)
		// this.body.setRestitution(restitution)
		// this.body.setDamping(damping)

		this.world.addRigidBody(this.rigidBody)
	}

	destructor() {
		this.world.removeRigidBody(this.rigidBody)
	}
}
