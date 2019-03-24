
import {Network} from "./network.js"
import {Update} from "../interfaces.js"

export class LoopbackNetwork extends Network {
	send(update: Update): void {
		this.applyUpdate(update)
	}
}
