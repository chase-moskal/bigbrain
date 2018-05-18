
import {Scene, Engine} from "babylonjs"

import {Input} from "./watcher"
import {Manager} from "./manager"
import {Entity, GenericEntity} from "./entity"

export interface StandardContext {
	readonly host: boolean
	readonly manager: Manager
}

export interface StateEntry { readonly type: string }
export type StateEntries = Map<string, StateEntry>
export interface State { entries: StateEntries }
export interface Message { readonly to: string }
export interface Update {
	messages: Message[]
	allEntries?: { [id: string]: StateEntry }
	someEntries?: { [id: string]: StateEntry }
}

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
