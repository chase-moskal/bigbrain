
import {observable, autorun} from "mobx"

import {Entity} from "./entity.js"
import {Manager} from "./manager.js"
import {replicate} from "./replicate.js"
import {LoopbackNetwork} from "./network/loopback-network.js"
import {
	State,
	TickInfo,
	ModeOfConduct,
	StandardContext,
	ConductorOptions
} from "./interfaces.js"

export class Conductor<AdditionalContext extends Object = Object> {
	readonly manager: Manager
	private readonly entities: Map<string, Entity>

	constructor({entityClasses, context: moreContext = <AdditionalContext>{}}: ConductorOptions<AdditionalContext>) {
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
			...<any>moreContext,
			...<StandardContext>{
				mode,
				manager,
				network
			}
		}

		autorun(() => replicate({context, state, entities, entityClasses}))

		this.manager = manager
	}

	logicTick(tickInfo: TickInfo) {
		for (const [id, entity] of this.entities)
			entity.logicTick(tickInfo)
	}

	hyperTick(tickInfo: TickInfo) {
		for (const [id, entity] of this.entities)
			entity.hyperTick(tickInfo)
	}

	slowTick(tickInfo: TickInfo) {
		for (const [id, entity] of this.entities)
			entity.slowTick(tickInfo)
	}
}
