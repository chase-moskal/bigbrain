
import {
	Entry,
	Action,
	LogicInput,
	LogicOutput,
	ActionInput,
	ActionOutput,
	MimicInput,
	MimicOutput,
	EntityOptions,
	SendActionInput,
} from "./interfaces"

abstract class EntityCommon {
	readonly id: string

	constructor({id}: EntityOptions) {
		this.id = id
	}

	abstract extraction(): void
}

export abstract class EntityHost<E extends Entry> extends EntityCommon {
	abstract action(input: ActionInput<E>): ActionOutput<E>
	abstract logic(input: LogicInput<E>): LogicOutput<E>
}

export abstract class EntityClient<E extends Entry> extends EntityCommon {
	protected sendAction<A extends Action = Action>(input: SendActionInput) {}
	abstract mimic(input: MimicInput<E>): MimicOutput
}

export abstract class EntityRemote<E extends Entry> extends EntityCommon {
	abstract mimic(input: MimicInput<E>): MimicOutput
}
