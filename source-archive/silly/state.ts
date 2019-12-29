
import {generateId} from "../../source/toolbox/generate-id.js"

import {
	Entry,
	Entries,
	Replicator,
	NetworkOptions,
} from "./interfaces.js"

export class State {
	private _replicator: Replicator
	private _entries: { [id: string]: Entry }

	setEntries(entries: Entries) {
		this._entries = entries
	}

	getEntries(): Entries {
		return this._entries
	}

	getEntry(id: string): Entry {
		return this._entries[id]
	}

	setEntry(id: string, entry: Entry) {
		this._entries[id] = entry
	}

	insert(entry: Entry): string {
		const id = generateId()
		this._entries[id] = entry
		this._replicator.insertion(id, entry)
		return id
	}

	extract(id: string): void {
		delete this._entries[id]
		this._replicator.extraction(id)
	}
}

export class NetworkHost {
	private _state: State
	private _messageInbox = []
}

export class NetworkClient {
	private _state: State
	private _outbox = {
		deltas: [
			{
				entries: {
					"a123": {
						position: [1, 2, 3]
					}
				},
				priority: 100
			}
		],
		messages: []
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
