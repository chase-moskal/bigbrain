
import {observable} from "mobx"
import * as deepFreeze from "deep-freeze"

import {copy} from "./toolbox"
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
	private readonly state: State
	protected readonly context: gContext

	constructor(options: EntityOptions<gContext>) {
		Object.assign(this, options)
	}

	get entry(): gStateEntry {
		const raw = this.state.entries.get(this.id)
		return raw
			? deepFreeze(copy(raw))
			: raw
	}

	async init() {}
	logic(tick: TickInfo) {}
	abstract async destructor(): Promise<void>
}

export class GenericEntity extends Entity {
	async destructor() {}
}
