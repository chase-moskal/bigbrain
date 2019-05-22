
import {Service} from "./toolbox-interfaces.js"

export class ServiceMaster implements Service {
	protected services: Service[]

	deconstruct() {
		for (const service of this.services) service.deconstruct()
	}

	start() {
		for (const service of this.services) service.start()
	}

	stop() {
		for (const service of this.services) service.stop()
	}
}
