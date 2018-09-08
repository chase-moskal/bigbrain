
import {ReplicateParams} from "./interfaces"
import {getEntityClass} from "./toolbox/get-entity-class"

export async function replicate({
	context, state, entities, entityClasses
}: ReplicateParams): Promise<void> {

	const initiates: Promise<void>[] = []
	const degenerates: Promise<void>[] = []

	// add new entities
	for (const [id, entry] of Array.from(state.entries)) {
		if (!entities.has(id)) {
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
