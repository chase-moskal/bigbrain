
import {Scene, Engine} from "babylonjs"

import {Input} from "./watcher"
import {Manager} from "./manager"
import {Network} from "./network"
import {Entity, GenericEntity} from "./entity"

export enum OrchestrationMode {
	Alone,
	Host,
	Client
}

export interface StandardContext {
	readonly mode: OrchestrationMode
	readonly manager: Manager
	readonly network: Network
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

export const VectorZero: Vector = [0, 0, 0]
export const QuaternionZero: Quaternion = [0, 0, 0, 0]

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
