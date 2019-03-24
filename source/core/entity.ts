
import {observable} from "mobx"

const deepFreeze = (o: any) => o
// import * as deepFreeze from "deep-freeze"

import {copy} from "./toolbox/copy.js"
import {
	State,
	Message,
	TickInfo,
	StateEntry,
	EntityOptions,
	StandardContext
} from "./interfaces.js"

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
	abstract async deconstruct(): Promise<void>
	logicTick(tick: TickInfo): void {}
	hyperTick(tick: TickInfo): void {}
	slowTick(tick: TickInfo): void {}
}

export class GenericEntity extends Entity {
	async initialize() {}
	async deconstruct() {}
}
