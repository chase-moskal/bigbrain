
import {getEntityClass} from "./toolbox"
import {ReplicateParams} from "./interfaces"

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
