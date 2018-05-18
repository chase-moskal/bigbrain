
import {action} from "mobx"
import {State, StandardContext, Message, Update} from "./interfaces"
import {assignPropsOntoMap, copy} from "./toolbox"

export abstract class Network {
	protected readonly state: State
	protected readonly context: StandardContext
	protected readonly handleMessages: (messages: Message[]) => void

	constructor({state, context, handleMessages}: {
		state: State
		context: StandardContext
		handleMessages: (messages: Message[]) => void
	}) {
		Object.assign(this, {state, context, handleMessages})
	}

	@action
	applyUpdate(update: Update) {
		if (update.allEntries) {
			this.state.entries.clear()
		}
		if (update.allEntries || update.someEntries) {
			assignPropsOntoMap(copy(update.allEntries), this.state.entries)
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
