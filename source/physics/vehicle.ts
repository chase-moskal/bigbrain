
import {Bearings, Physique, Vector, Quaternion} from "./data"
import {Ammo, conversionTools, vect, quat} from "./ammo-liaison"

export interface WheelAxleDetails {
	measure: number
	radius: number
	width: number
	height: number
	halfTrack: number
}

export interface SuspensionDetails {
	stiffness: number
	relaxation: number
	compression: number
	restLength: number
}

export interface VehiclePhysique extends Physique {
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

export interface VehicleParams {
	ammo: typeof Ammo
	world: any
	bearings: Bearings
	physique: VehiclePhysique
}

export default class Vehicle {
	private readonly vehicle
	private engineForce = 0
	private vehicleSteering = 0
	private breakingForce = 0

	constructor({ammo, world, bearings, physique}: VehicleParams) {
		const {position, rotation} = bearings
		const {
			mass, size, friction,
			frontWheels, backWheels, suspension, rollInfluence, steeringIncrement,
			steeringClamp, maxEngineForce, maxBrakingForce
		} = physique
		const {bvect, bquat} = conversionTools(ammo)

		const transform = new ammo.btTransform()
		transform.setIdentity()
		transform.setOrigin(bvect)
		transform.setRotation(bquat(rotation))
		const motionState = new ammo.btDefaultMotionState(transform)
		const localInertia = new ammo.btVector3(0, 0, 0)
		const geometry = new ammo.btBoxShape(bvect(size))
		geometry.calculateLocalInertia(mass, localInertia)

		const body = new ammo.btRigidBody(new ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia))
		body.setActivationState(ammo.ActivationState.DisableDeactivation)
		world.addRigidBody(body)

		// raycast vehicle
		const tuning = new ammo.btVehicleTuning()
		const rayCaster = new ammo.btDefaultVehicleRaycaster(world)
		const vehicle = this.vehicle = new ammo.btRaycastVehicle(tuning, body, rayCaster)
		vehicle.setCoordinateSystem(0, 1, 2)
		world.addAction(vehicle)

		// wheels
		const wheelMeshes = []
		const wheelDirectionCS0 = new ammo.btVector3(0, -1, 0)
		const wheelAxleCS = new ammo.btVector3(-1, 0, 0)

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
			wheelInfo.set_m_wheelsDampingRelaxation(suspension.relaxation)
			wheelInfo.set_m_wheelsDampingCompression(suspension.compression)
			wheelInfo.set_m_frictionSlip(friction)
			wheelInfo.set_m_rollInfluence(rollInfluence)
		}

		addWheel(true, new ammo.btVector3(frontWheels.halfTrack, frontWheels.height, frontWheels.measure), frontWheels.radius, frontWheels.width, Fourwheel.FrontLeft)
		addWheel(true, new ammo.btVector3(-frontWheels.halfTrack, frontWheels.height, frontWheels.measure), frontWheels.radius, frontWheels.width, Fourwheel.FrontRight)
		addWheel(false, new ammo.btVector3(-backWheels.halfTrack, backWheels.height, backWheels.measure), backWheels.radius, backWheels.width, Fourwheel.BackLeft)
		addWheel(false, new ammo.btVector3(backWheels.halfTrack, backWheels.height, backWheels.measure), backWheels.radius, backWheels.width, Fourwheel.BackRight)
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
				position: vect(transform.getOrigin()),
				rotation: quat(transform.getRotation())
			}
		})
	}

	getChassis(): {position: Vector; rotation: Quaternion} {
		const {vehicle} = this
		const transform = vehicle.getChassisWorldTransform()
		return {
			position: vect(transform.getOrigin()),
			rotation: quat(transform.getRotation())
		}
	}
}
