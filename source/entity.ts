
import {observable} from "mobx"
import * as deepFreeze from "deep-freeze"

import {copy} from "./toolbox"
import {StandardContext, StateEntry, Message, State} from "./interfaces"

export abstract class Entity<
	gContext extends StandardContext = StandardContext,
	gStateEntry extends StateEntry = StateEntry,
	gAssets = any
> {
	static load(context: StandardContext & any) {
		return {}
	}

	protected readonly context: any
	private readonly state: State

	readonly id: string
	get entry(): gStateEntry { return deepFreeze(copy(this.state.entries.get(this.id))) }
	@observable inbox: Message[] = []

	constructor({id, context, state, assets}: EntityOptions<any>) {
		this.id = id
		this.context = context
		this.state = state
		this.init(assets)
	}

	init(assets: gAssets): void {}

	abstract destructor(): void
}

export class GenericEntity extends Entity {
	destructor() {}
}

export interface EntityOptions<gContext = any, gAssets = any> {
	id: string
	context: gContext
	state: State
	assets: gAssets
}

export type EntityClasses = {[name: string]: typeof GenericEntity}
