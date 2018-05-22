
import {action} from "mobx"
import {assignPropsOntoMap, copy} from "./toolbox"
import {State, Message, Update} from "./interfaces"

export abstract class Network {
	protected readonly host: boolean
	protected readonly state: State
	protected readonly handleMessages: (messages: Message[]) => void

	constructor({state, host, handleMessages}: {
		host: boolean
		state: State
		handleMessages: (messages: Message[]) => void
	}) {
		Object.assign(this, {state, host, handleMessages})
	}

	@action applyUpdate(update: Update) {
		const {state} = this
		const {allEntries, someEntries} = update
		if (allEntries) {
			state.entries.clear()
			assignPropsOntoMap(copy(allEntries), state.entries)
		}
		if (someEntries) {
			Object.keys(someEntries).forEach(key => {
				const entry = state.entries.get(key)
				if (entry) {
					const fresh = copy(someEntries[key])
					state.entries.set(key, fresh)
				}
			})
		}
		this.handleMessages(update.messages)
	}

	abstract send(update: Update): void
}

export class LoopbackNetwork extends Network {
	send(update: Update): void {
		this.applyUpdate(update)
	}
}
