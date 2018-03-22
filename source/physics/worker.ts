
type AmmoModule = any
declare const Ammo: any
const scope = <any> self

interface WorkOrder {
	id: string
	type: "add" | "update" | "remove"
	details?: {
		physique: any
		bearings: any
	}
}

class PhysicsWorker {
	private ammo: AmmoModule

	constructor({ammoUrl}: {ammoUrl: string}) {
		scope.onmessage = event => {this.acceptOrders(event.data)}
		importScripts(ammoUrl)
		Ammo().then(ammo => {
			this.ammo = ammo
			scope.postMessage(["READY"])
		})
	}

	acceptOrders(orders: string[]): void {
		scope.postMessage(orders.map(order => this.ammo ? `*${order}*` : `-${order}-`))
		// if (!this.ammo) return null
	}
}

const worker = new PhysicsWorker({
	ammoUrl: "../../node_modules/ammo.js/builds/ammo.js"
})
