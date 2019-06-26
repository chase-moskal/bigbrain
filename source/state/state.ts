
import {freezie} from "../toolbox/freezie.js"
import {copyDeep} from "../toolbox/copy-deep.js"

import {Entry, Id} from "./interfaces.js"

const _write = Symbol("_write")
const _entries = Symbol("_entries")
const _replicator = Symbol("_replicator")
const _frozenEntries = Symbol("_frozenEntries")

export interface StateOptions {
	hostState?: State
}

export interface Replicator {
	insertion(id, entryAccess): void
	extraction(id): void
}

let count = 0
const generateId = () => (count++).toString()

export class State {
	private [_replicator]

	private [_entries]: {[id: string]: Entry} = {}
	private [_frozenEntries]: {[id: string]: Entry} = {}
	// // should probably use weakmaps to associate these?
	// // otherwise compose these parts into a bigger entry object?
	// private [_entryAccessObjects]: {[id: string]: Entry} = {}

	constructor({replicator}: {replicator?: any}) {
		this[_replicator] = replicator
	}

	private [_write](id: string, entry: Entry) {
		this[_entries][id] = entry
		this[_frozenEntries][id] = freezie(copyDeep(entry))
	}

	getEntryAccess(id: string) {
		return {
			read: () => this[_frozenEntries][id],
			write: (entry: Entry) => this[_write](id, entry)
		}
	}

	insert(entry: Entry): {id: string, entryAccess: any} {
		const id = generateId()
		this[_write](id, entry)
		const entryAccess = this.getEntryAccess(id)
		this[_replicator].insertion(id, entryAccess)
		return {id, entryAccess}
	}

	extract(id: string): void {
		delete this[_entries][id]
		delete this[_frozenEntries][id]
	}
}

/*

interface BoxEntry {
	type: "Box"
	count: number
}

class Box extends Entity {

	insertion() {}
	extraction() {}

	// magic happens to handle a networked action message queue, only called on host
	handleAction(action) {
		if (action.type === "add") {
			const {x} = action
			const {count, ...other} = this.entry.read()
			this.entry.write({count: count + x, ...other})
		}
	}

	logic() {
		// put a new action on the message queue
		if (something) this.action({type: "add", x: 1})
	}
}

const replicator = new EntityReplicator({
	entityClasses: {Box}
})

const state = new State({replicator})

const {entry, promisedEntity} = state.insert({x: 1, y: 2, z: 3})
const entity = await promisedEntity

const {x, ...more} = entry.read()
entry.write({x: x + 1, ...more})

*/
