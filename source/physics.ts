
export type Ammo = any

export type Vector = [number, number, number]
export type Quaternion = [number, number, number, number]

export interface Physique {
	mass: number
	size: Vector
	position: Vector
	rotation: Quaternion
	friction: number
}

const enum ActivationState {
	DisableDeactivation = 4
}

const ammoConversionTools = (ammo: Ammo) => {
	const {btVector3, btQuaternion} = ammo
	return {
		bvect: (vector: Vector) => new btVector3(...vector),
		bquat: (quater: Quaternion) => new btQuaternion(...quater)
	}
}

const xvect = p => <Vector>[p.x(), p.y(), p.z()]
const xquat = q => <Quaternion>[q.x(), q.y(), q.z(), q.w()]

export class SusaBox {
	private readonly body
	private readonly transformAux

	constructor({ammo, world, physique}: {ammo: Ammo, world: any, physique: Physique}) {
		const {mass, size, position, rotation, friction} = physique
		const {
			btVector, btQuaternion, btBoxShape, btTransform,
			btDefaultCollisionConfiguration, btDefaultMotionState, btVector3,
			btRigidBodyConstructionInfo, btRigidBody
		} = ammo
		const {bvect, bquat} = ammoConversionTools(ammo)

		const geometry = new btBoxShape(bvect(size))
		this.transformAux = new btTransform()

		const transform = new btTransform()
		transform.setIdentity()
		transform.setOrigin(bvect(position))
		transform.setRotation(bquat(rotation))

		const motionState = new btDefaultMotionState(transform)
		const localInertia = new btVector3(0, 0, 0)
		geometry.calculateLocalInertia(mass, localInertia)

		const bodyInfo = new btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia)
		const body = this.body = new btRigidBody(bodyInfo)

		body.setFriction(friction)
		body.setActivationState(ActivationState.DisableDeactivation)
		// body.setRestitution(restitution)
		// body.setDamping(damping)

		world.addRigidBody(body)
	}

	getBearings(): {position: Vector; rotation: Quaternion} {
		const state = this.body.getMotionState()
		if (state) {
			const {transformAux} = this
			state.getWorldTransform(transformAux)
			return {
				position: xvect(transformAux.getOrigin()),
				rotation: xquat(transformAux.getRotation())
			}
		}
	}
}

export interface WheelAxleDetails {
	measure: number
	radius: number
	width: number
	height: number
	halfTrack: number
}

export interface SuspensionDetails {
	stiffness: number
	damping: number
	compression: number
	restLength: number
}

export interface VehicularPhysique extends Physique {
	frontWheels: WheelAxleDetails
	backWheels: WheelAxleDetails
	suspension: SuspensionDetails
	rollInfluence: number
	steeringIncrement: number
	steeringClamp: number
	maxEngineForce: number
	maxBrakingForce: number
}

const enum Fourwheel {
	FrontLeft = 0,
	FrontRight,
	BackLeft,
	BackRight
}

export class SusaVehicle {
	private readonly vehicle
	private engineForce = 0
	private vehicleSteering = 0
	private breakingForce = 0

	constructor({ammo, world, physique}: {ammo: Ammo, world: any, physique: VehicularPhysique}) {
		const {
			mass, size, position, rotation, friction,
			frontWheels, backWheels, suspension, rollInfluence, steeringIncrement,
			steeringClamp, maxEngineForce, maxBrakingForce
		} = physique

		const {
			btBoxShape, btVector3, btTransform, btDefaultMotionState, btRigidBody,
			btRigidBodyConstructionInfo, btVehicleTuning, btDefaultVehicleRaycaster,
			btRaycastVehicle
		} = ammo

		const {bvect, bquat} = ammoConversionTools(ammo)

		const geometry = new btBoxShape(bvect(size))
		const transform = new btTransform()
		transform.setIdentity()
		transform.setOrigin(bvect)
		transform.setRotation(bquat(rotation))
		const motionState = new btDefaultMotionState(transform)
		const localInertia = new btVector3(0, 0, 0)
		geometry.calculateLocalInertia(mass, localInertia)
		const body = new btRigidBody(new btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia))
		body.setActivationState(ActivationState.DisableDeactivation)
		world.addRigidBody(body)

		// Raycast Vehicle
		const tuning = new btVehicleTuning()
		const rayCaster = new btDefaultVehicleRaycaster(world)
		const vehicle = this.vehicle = new btRaycastVehicle(tuning, body, rayCaster)
		vehicle.setCoordinateSystem(0, 1, 2)
		world.addAction(vehicle)

		// Wheels
		const wheelMeshes = []
		const wheelDirectionCS0 = new btVector3(0, -1, 0)
		const wheelAxleCS = new btVector3(-1, 0, 0)

		function addWheel(isFront, pos, radius, width, index) {
			const wheelInfo = vehicle.addWheel(
					pos,
					wheelDirectionCS0,
					wheelAxleCS,
					suspension.restLength,
					radius,
					tuning,
					isFront
			)
			wheelInfo.set_m_suspensionStiffness(suspension.stiffness)
			wheelInfo.set_m_wheelsDampingRelaxation(suspension.damping)
			wheelInfo.set_m_wheelsDampingCompression(suspension.compression)
			wheelInfo.set_m_frictionSlip(friction)
			wheelInfo.set_m_rollInfluence(rollInfluence)
		}

		addWheel(true, new btVector3(frontWheels.halfTrack, frontWheels.height, frontWheels.measure), frontWheels.radius, frontWheels.width, Fourwheel.FrontLeft)
		addWheel(true, new btVector3(-frontWheels.halfTrack, frontWheels.height, frontWheels.measure), frontWheels.radius, frontWheels.width, Fourwheel.FrontRight)
		addWheel(false, new btVector3(-backWheels.halfTrack, backWheels.height, backWheels.measure), backWheels.radius, backWheels.width, Fourwheel.BackLeft)
		addWheel(false, new btVector3(backWheels.halfTrack, backWheels.height, backWheels.measure), backWheels.radius, backWheels.width, Fourwheel.BackRight)
	}

	setEngineForce(force: number) {
		const {vehicle} = this
		vehicle.applyEngineForce(force, Fourwheel.BackLeft)
		vehicle.applyEngineForce(force, Fourwheel.BackRight)
	}

	setBrake(force: number) {
		const {vehicle} = this
		vehicle.setBrake(force / 2, Fourwheel.FrontLeft)
		vehicle.setBrake(force / 2, Fourwheel.FrontRight)
		vehicle.setBrake(force, Fourwheel.BackLeft)
		vehicle.setBrake(force, Fourwheel.BackRight)
	}

	setSteering(steer: number) {
		const {vehicle} = this
		vehicle.setSteeringValue(steer, Fourwheel.FrontLeft)
		vehicle.setSteeringValue(steer, Fourwheel.FrontRight)
	}

	getWheels(): {position: Vector; rotation: Quaternion}[] {
		const {vehicle} = this
		const wheelCount = vehicle.getNumWheels()

		return Array(wheelCount).map((value, index) => {
			vehicle.updateWheelTransform(index, true)
			const transform = vehicle.getWheelTransformWS(index)
			return {
				position: xvect(transform.getOrigin()),
				rotation: xquat(transform.getRotation())
			}
		})
	}

	getChassis(): {position: Vector; rotation: Quaternion} {
		const {vehicle} = this
		const transform = vehicle.getChassisWorldTransform()
		return {
			position: xvect(transform.getOrigin()),
			rotation: xquat(transform.getRotation())
		}
	}
}

export default class SusaPhysics {
	private readonly bullet
	private readonly config
	private readonly dispatcher
	private readonly broadphase
	private readonly solver
	private readonly world

	private transformAux
	private syncList = []
	private time = 0
	private objectTimePeriod = 3
	private timeNextSpawn = this.time + this.objectTimePeriod
	private maxNumObjects = 30

	constructor({bullet, gravity = 9.82}: {bullet: any, gravity?: number}) {
		this.bullet = bullet
		this.config = new bullet.btDefaultCollisionConfiguration()
		this.dispatcher = new bullet.btCollisionDispatcher(this.config)
		this.broadphase = new bullet.btDbvtBroadphase()
		this.solver = new bullet.btSequentialImpulseConstraintSolver()
		this.world = new bullet.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.config)
		this.world.setGravity(new bullet.btVector3(0, -gravity, 0))
		this.transformAux = new bullet.btTransform(0, 0, 0)
	}

	private async step(time: number) {
		this.world.stepSimulation(time, 10)
	}
}
