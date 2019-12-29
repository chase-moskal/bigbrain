
import {Replicator, State} from "../interfaces.js"

export class GameReplicator implements Replicator {
	protected _state: State

	constructor({state}: {state: State}) {
		this._state = state
	}

	replicate() {
		return {messages: []}
	}
}
