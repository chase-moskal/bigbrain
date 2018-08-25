
import {observable} from "mobx"

import {Input} from "./input"
import {inputKeycodeRelations} from "./input-keycode-relations"
import {otherwiseSupportedInputs} from "./otherwise-supported-inputs"
import {Bindings, WatcherOptions, Status} from "./watcher-interfaces"

export class Watcher<gBindings extends Bindings = Bindings> {
	private readonly eventTarget: EventTarget
	private readonly bindings: gBindings

	@observable
	readonly status: Status<gBindings>

	constructor({eventTarget = window, bindings}: WatcherOptions<gBindings>) {
		this.eventTarget = eventTarget
		this.bindings = bindings

		// initialize status for each binding, throw error on unknown input
		const status = <Status<gBindings>>{}
		for (const alias of Object.keys(bindings)) {
			const inputs = bindings[alias]
			for (const input of inputs)
				if (
					inputKeycodeRelations.find(relation => relation.input === input) !== undefined
					&& otherwiseSupportedInputs.find(supported => supported === input) !== undefined
				) throw `unknown input: ${input}`
			status[alias] = null
		}
		this.status = status

		this.start()
	}

	private readonly listeners = {
		keydown: (event: KeyboardEvent) => {
			const struckInput = this.getInputByKeycode(event.keyCode)
			if (struckInput === null) return
			for (const struckAlias of this.getAliasesForInput(struckInput))
				this.status[struckAlias] = true
			event.preventDefault()
			event.stopPropagation()
		},
		keyup: (event: KeyboardEvent) => {
			const releasedInput = this.getInputByKeycode(event.keyCode)
			if (releasedInput === null) return
			for (const releasedAlias of this.getAliasesForInput(releasedInput))
				this.status[releasedAlias] = false
			event.preventDefault()
			event.stopPropagation()
		},
		mousedown: (event: MouseEvent) => {
			for (const struckAlias of this.getAliasesForInput(Input.MouseLeft))
				this.status[struckAlias] = true
			event.preventDefault()
			event.stopPropagation()
		},
		mouseup: (event: MouseEvent) => {
			for (const releasedAlias of this.getAliasesForInput(Input.MouseLeft))
				this.status[releasedAlias] = false
			event.preventDefault()
			event.stopPropagation()
		}
	}

	start() {
		for (const eventType of Object.keys(this.listeners)) {
			const listener = this.listeners[eventType]
			this.eventTarget.addEventListener(eventType, listener)
		}
	}

	stop() {
		for (const eventType of Object.keys(this.listeners)) {
			const listener = this.listeners[eventType]
			this.eventTarget.removeEventListener(eventType, listener)
		}
	}

	destructor() {
		this.stop()
	}

	private getInputByKeycode(code: number): Input {
		const relation = inputKeycodeRelations.find(relationship => relationship.code === code)
		return relation ? relation.input : null
	}

	private getAliasesForInput(input: Input): string[] {
		return Object.keys(this.bindings)
			.filter(alias => this.bindings[alias].some(i => i === input))
	}
}
