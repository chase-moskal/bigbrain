
//
// isomorphic
//

export interface Delta {}

export interface Whole {}

export interface Update {
	delta: Delta
	whole?: Whole
}

export interface Message {
	id: string
}

export interface Entry {
	id: string
}

export interface State {
	getEntry(id: string): Entry
	applyUpdate(update: Update): void
}

//
// host
//

export interface StateHost extends State {
	insert(id: string, entry: Entry): void
	extract(id: string): void
}

export interface Priority {
	delta: Delta
	importance: number
}

export interface Simulator {
	simulate(messages: Message[]): {priorities: Priority[]}
}

export interface NetworkHost {
	collect(): {messages: Message[]}
	distribute(priorities: Priority[]): void
}

//
// client
//

export interface NetworkClient {
	send(messages: Message[]): void
	receive(): {whole?: Whole; delta: Delta}
}

export interface Replicator {
	replicate(): {messages: Message[]}
}
