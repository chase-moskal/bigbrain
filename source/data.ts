
export type Vector = [number, number, number]
export type Quaternion = [number, number, number, number]

export const VectorZero = [0, 0, 0]
export const QuaternionZero = [0, 0, 0, 0]

/**
 * Spatial relationship with the world
 */
export interface Bearings {
	position: Vector
	rotation: Quaternion
}

/**
 * Physical characteristics
 */
export interface Physique {
	mass: number
	size: Vector
	friction?: number
	damping?: number
	restitution?: number
}
