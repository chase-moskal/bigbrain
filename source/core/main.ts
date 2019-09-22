
import {
	StateIdea,
	SimulatorIdea,
	ReplicatorIdea,
	NetworkHostIdea,
	NetworkClientIdea,
} from "./interfaces.js"

export function hostMainloop({
	state,
	simulator,
	networkHost,
}: {
	state: StateIdea
	simulator: SimulatorIdea
	networkHost: NetworkHostIdea
}) {
	const {priorities} = simulator.tick()
	for (const priority of priorities) {
		const {delta} = priority
		state.apply({delta})
		networkHost.queue({priority})
	}
	const {messages} = networkHost.tick()
	simulator.queue(messages)
}

export function clientMainloop({
	state,
	replicator,
	networkClient,
}: {
	state: StateIdea
	replicator: ReplicatorIdea
	networkClient: NetworkClientIdea
}) {
	const {whole, delta} = networkClient.tick()
	state.apply({whole, delta})
	replicator.tick({state})
}
