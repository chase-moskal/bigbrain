
//
// isomorphic
//

export interface Whole {}
export interface Delta {}
export interface Message {}

export interface StateIdea {
	extract(i: {id: string}): void
	insert(i: {id: string}): {id: string}
	apply(i: {whole?: Whole; delta: Delta}): void
}

//
// host
//

export interface SimulatorIdea {
	queue(i: {messages: Message}): void
	tick(): {
		priorities: PriorityIdea[]
	}
}

export interface NetworkHostIdea {
	queue(i: {priority: PriorityIdea}): void
	tick()
}

export interface PriorityIdea {
	delta: Delta
	importance: number
}

//
// client
//

export interface NetworkClientIdea {
	tick(): {whole?: Whole; delta: Delta}
}

export interface ReplicatorIdea {
	tick(i: {state: StateIdea}): void
}
