
import {NetworkHost, Priority} from "../interfaces.js"

export class GameNetworkHost implements NetworkHost {

	collect() {
		return {messages: []}
	}

	distribute(priorities: Priority[]) {
		return
	}
}
