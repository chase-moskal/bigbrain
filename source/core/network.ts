
import {Priority} from "./priority.js"

export class Network {
	inbox = []
	outbox = []
	priorities: Priority[] = []

	tick() {
		const items = this.priorities
			.map(priority => priority.poll())
			.sort((a, b) => a.weight < b.weight ? -1 : 1)
			.map(priority => priority.value)
	}
}
