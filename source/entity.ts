
import {observable} from "mobx"
import * as deepFreeze from "deep-freeze"

import {copy} from "./toolbox"
import {StandardContext, StateEntry, Message, State} from "./interfaces"

export abstract class Entity<
	gContext extends StandardContext = StandardContext,
	gStateEntry extends StateEntry = StateEntry
> {
	readonly id: string
	protected readonly context: gContext
	private readonly state: State
	@observable inbox: Message[] = []

	get entry(): gStateEntry {
		return deepFreeze(copy(this.state.entries.get(this.id)))
	}

	constructor(options: EntityOptions<gContext>) {
		Object.assign(this, options)
	}

	abstract async destructor(): Promise<void>
}

export class GenericEntity extends Entity {
	async destructor() {}
}

export interface EntityOptions<gContext = any> {
	id: string
	context: gContext
	state: State
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
