
export type Vector = [number, number, number]
export type Quaternion = [number, number, number, number]

/**
 * Data which describes a spatial relationship with the world
 */
export interface Bearings {
	position: Vector
	rotation: Quaternion
}

/**
 * Data which describes physical characteristics
 */
export interface Physique {
	mass: number
	size: Vector
	friction?: number
	damping?: number
	restitution?: number
}
