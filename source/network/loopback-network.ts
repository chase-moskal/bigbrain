
import {Network} from "./network"
import {Update} from "../interfaces"

export class LoopbackNetwork extends Network {
	send(update: Update): void {
		this.applyUpdate(update)
	}
}
