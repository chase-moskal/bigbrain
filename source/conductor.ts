
import {observable, autorun, action} from "mobx"

import {Manager} from "./manager"
import {getEntityClass} from "./toolbox"
import {Entity, EntityClasses} from "./entity"
import {Network, LoopbackNetwork} from "./network"
import {State, StandardContext, StateEntries, ModeOfConduct} from "./interfaces"

export interface ConductorOptions<AdditionalContext = any> {
	mode: ModeOfConduct
	entityClasses: EntityClasses
	context?: AdditionalContext
}

export class Conductor<AdditionalContext = any> {
	readonly manager: Manager

	constructor({entityClasses, context: moreContext = {}}: ConductorOptions) {
		const state: State = observable({entries: new Map()})
		const entities: Map<string, Entity> = new Map()
		const manager = new Manager({state, entities})
		const mode = ModeOfConduct.Alone

		const network = new LoopbackNetwork({
			mode,
			state,
			handleMessages: messages => {
				for (const message of messages) {
					const entity = entities.get(message.to)
					if (entity) entity.inbox.unshift(message)
					else console.warn(`message undeliverable: to entity id "${message.to}"`, message)
				}
			}
		})

		const context = <StandardContext & AdditionalContext>{
			...moreContext,
			...<StandardContext>{
				mode,
				manager,
				network
			}
		}

		autorun(() => replicate({context, state, entities, entityClasses}))

		this.manager = manager
	}
}

export interface ReplicateParams {
	state: State
	context: StandardContext
	entityClasses: EntityClasses
	entities: Map<string, Entity>
}

export async function replicate({
	context, state, entities, entityClasses
}: ReplicateParams): Promise<void> {

	const initiates: Promise<void>[] = []
	const degenerates: Promise<void>[] = []

	// add new entities
	for (const [id, entry] of Array.from(state.entries)) {
		if (!entities.has(id)) {
			const entry = state.entries.get(id)
			const Entity = getEntityClass(entry.type, entityClasses)
			const entity = new Entity({id, context, state})
			entities.set(id, entity)
			initiates.push(entity.init())
		}
	}

	// remove old entities
	for (const id of entities.keys()) {
		if (!state.entries.has(id)) {
			const entity = entities.get(id)
			degenerates.push(entity.destructor())
			entities.delete(id)
		}
	}

	// wait for all initiations and degenerations
	await Promise.all([...initiates, ...degenerates])
}
