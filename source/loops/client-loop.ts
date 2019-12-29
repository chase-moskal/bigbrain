
import {
	State,
	Replicator,
	NetworkClient,
} from "../interfaces.js"

export function clientLoop({
	state,
	network,
	replicator,
}: {
	state: State
	replicator: Replicator
	network: NetworkClient
}) {

	// receive updates from the host
	const update = network.receive()

	// apply all updates to our state
	state.applyUpdate(update)

	// conform the game world to the current state
	const {messages} = replicator.replicate()

	// send messages off to the host to consider
	network.send(messages)
}

/*

// MAYBE GO MORE FUNCTIONAL STYLE!?
// ================================

//: {networkClient, state, world}

	const update = receiveFromHost(networkClient)

	applyToState({
		state,
		update,
	})

	const messages = replicate({
		world,
		state,
	})

	sendToHost({
		messages,
		networkClient,
	})

*/
