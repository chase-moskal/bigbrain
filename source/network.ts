
import {action} from "mobx"
import {assignPropsOntoMap, copy} from "./toolbox"
import {State, Message, Update, OrchestrationMode} from "./interfaces"

export abstract class Network {
	protected readonly mode: OrchestrationMode
	protected readonly state: State
	protected readonly handleMessages: (messages: Message[]) => void

	constructor({state, mode, handleMessages}: {
		mode: OrchestrationMode
		state: State
		handleMessages: (messages: Message[]) => void
	}) {
		Object.assign(this, {state, mode, handleMessages})
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
