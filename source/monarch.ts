
import * as uuid from "uuid/v4"
import {observable, autorun, action} from "mobx"

import {Manager} from "./manager"
import {getEntityClass} from "./toolbox"
import {Entity, EntityClasses} from "./entity"
import {Network, LoopbackNetwork} from "./network"
import {State, StandardContext} from "./interfaces"

/**
 * MONARCH GAME ORCHESTRATION CLASS
 *  - orchestrate the under-the-hood aspects of the game engine
 *  - control network connectivity decisions
 *  - expose manager instance to add/remove state entities
 *  - create/remove entity instances based on state (replication)
 *  - there is no main loop, each entity may run its own logic loops
 */
export class Monarch<gContext extends StandardContext = StandardContext> {
	private readonly context: gContext
	private readonly state: State
	private readonly entities: Map<string, Entity>
	private readonly network: Network
	private readonly entityClasses: EntityClasses

	readonly manager: Manager

	constructor({window, entityClasses, context: moreContext = {}}: MonarchOptions<Partial<gContext & any>>) {
		const state: State = observable({entries: new Map})
		const entities: Map<string, Entity> = new Map()
		const manager = new Manager({state, entities})

		const context = <StandardContext & gContext>{
			host: true,
			manager,
			...moreContext
		}

		const network = new LoopbackNetwork({
			state,
			context,
			handleMessages: messages => {
				for (const message of messages) {
					const entity = entities.get(message.to)
					if (entity) entity.inbox.unshift(message)
					else console.warn(`Message undeliverable: to entity id "${message.to}"`, message)
				}
			}
		})

		Object.assign(this, {context, state, entities, manager, network, entityClasses})

		autorun(() => this.replicate())
	}

	private async replicate(): Promise<void> {
		const {context, state, entities, manager, entityClasses} = this

		// add new entities
		for (const [id, entry] of Array.from(state.entries)) {
			if (!entities.has(id)) {
				const entry = state.entries.get(id)
				const Entity = getEntityClass(entry.type, entityClasses)
				const entity = new Entity({id, context, state})
				entities.set(id, entity)
			}
		}

		// remove old entities
		for (const id of entities.keys()) {
			if (!state.entries.has(id)) {
				const entity = entities.get(id)
				await entity.destructor()
				entities.delete(id)
			}
		}
	}
}

export interface MonarchOptions<MoreContext = any> {
	window: Window
	entityClasses: EntityClasses
	context?: MoreContext
}
