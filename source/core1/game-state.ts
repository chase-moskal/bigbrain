
import {State, Entry, Update} from "../interfaces.js"

export class GameState implements State {
	protected _data: {[id: string]: Entry} = {}

	getEntry(id: string): Entry {
		throw new Error("todo")
	}

	applyUpdate(update: Update): void {}
}
