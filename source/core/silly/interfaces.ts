
import {State} from "./state.js"
import {EntityHost, EntityClient} from "./entity.js"

//
// state
//

export interface Entry {
	id: string
	type: string
}

export interface Entries {
	[id: string]: Entry
}

export interface Replicator {
	insertion(id: string, entry: Entry): void
	extraction(id: string): void
}

//
// entities
//

export interface Entity {
	host: typeof EntityHost
	client: typeof EntityClient
}

export interface Entities {
	[type: string]: Entity
}

export interface EntityOptions {
	id: string
}

export interface Delta<E extends Entry> {
	entry: E
	networkPriority: number
}

export interface LogicInput<E extends Entry> {
	entry: E
}

export interface LogicOutput<E extends Entry> extends Delta<E> {}

export interface Action {
	type: string
}

export interface ActionInput<E extends Entry, A extends Action = Action> {
	action: A
	entry: E
}

export interface ActionOutput<E extends Entry> extends Delta<E> {}

export interface SendActionInput<A extends Action = Action> {
	action: A
	networkPriority: number
}

export interface SendActionOutput<> {}

export interface MimicInput<E extends Entry> {
	entry: E
}

export interface MimicOutput {}

//
// Network
//

export interface NetworkOptions {
	state: State
}
