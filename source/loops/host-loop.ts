
import {
	State,
	Simulator,
	NetworkHost,
} from "../interfaces.js"

export function hostLoop({
	state,
	network,
	simulator,
}: {
	state: State
	simulator: Simulator
	network: NetworkHost
}) {

	// receive messages from the clients
	const {messages} = network.collect()

	// simulate the game world for one tick
	const {priorities} = simulator.simulate(messages)

	// apply state deltas to our state
	for (const priority of priorities)
		state.applyUpdate(priority)

	// send network priorities to clients
	network.distribute(priorities)
}

/*

// MAYBE GO MORE FUNCTIONAL STYLE!?
// ================================

//: {networkHost, state, world}

	const messages = collectFromClients(networkHost)

	const priorities = simulate({
		state,
		world,
		messages,
	})

	distributeNetworkPriorities({
		state,
		priorities,
		networkHost,
	})

*/
