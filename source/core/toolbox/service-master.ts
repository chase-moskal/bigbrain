
import {Service} from "./toolbox-interfaces"

export class ServiceMaster implements Service {
	private services: Service[]

	constructor(services: Service[]) {
		this.services = services
	}

	destructor() {
		for (const service of this.services) service.destructor()
	}

	start() {
		for (const service of this.services) service.start()
	}

	stop() {
		for (const service of this.services) service.stop()
	}
}
