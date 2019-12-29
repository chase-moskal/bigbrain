
import {NetworkClient, Message} from "../interfaces.js"

export class GameNetworkClient implements NetworkClient {

	send(messages: Message[]) {}

	receive() {
		return {delta: {}}
	}
}
