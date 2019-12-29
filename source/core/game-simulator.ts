
import {Simulator, State, Message} from "../interfaces.js"

export class GameSimulator implements Simulator {
	protected _state: State

	constructor({state}: {state: State}) {
		this._state = state
	}

	queue(messages: Message[]) {
		return
	}

	simulate() {
		return {priorities: []}
	}
}
