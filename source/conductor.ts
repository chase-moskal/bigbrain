
import {observable, autorun} from "mobx"

import {Entity} from "./entity"
import {Manager} from "./manager"
import {replicate} from "./replicate"
import {LoopbackNetwork} from "./network"
import {
	State,
	TickInfo,
	ModeOfConduct,
	StandardContext,
	ConductorOptions
} from "./interfaces"

export class Conductor<AdditionalContext = any> {
	readonly manager: Manager
	private readonly entities: Map<string, Entity>

	constructor({entityClasses, context: moreContext = {}}: ConductorOptions<AdditionalContext>) {
		const state: State = observable({entries: new Map()})
		const entities: Map<string, Entity> = this.entities = new Map()
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

	logic(tick: TickInfo) {
		for (const [id, entity] of this.entities) {
			entity.logic(tick)
		}
	}
}
