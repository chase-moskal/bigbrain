
import {observable} from "mobx"
import * as deepFreeze from "deep-freeze"

import {copy} from "./toolbox/copy"
import {
	State,
	Message,
	TickInfo,
	StateEntry,
	EntityOptions,
	StandardContext
} from "./interfaces"

export abstract class Entity<
	gContext extends StandardContext = StandardContext,
	gStateEntry extends StateEntry = StateEntry
> {
	readonly id: string
	@observable inbox: Message[] = []
	protected readonly context: gContext

	private readonly state: State

	constructor(options: EntityOptions<gContext>) {
		Object.assign(this, options)
	}

	get entry(): gStateEntry {
		const raw = this.state.entries.get(this.id)
		return raw
			? deepFreeze(copy(raw))
			: raw
	}

	abstract async initialize(): Promise<void>
	abstract logic(tick: TickInfo): void
	abstract async deconstruct(): Promise<void>
}

export class GenericEntity extends Entity {
	async initialize() {}
	logic(tick: TickInfo) {}
	async deconstruct() {}
}
