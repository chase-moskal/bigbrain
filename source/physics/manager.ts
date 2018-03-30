
export interface PhysicsManagerOptions {
	workerUrl: string
}

const enum ResultType {}

export default class PhysicsManager {
	private readonly worker: Worker
	private count: number = 0

	private readonly pinger = () => {
		this.worker.postMessage([Date.now()])
		setTimeout(this.pinger, 10)
	}

	constructor({workerUrl}: PhysicsManagerOptions) {
		this.worker = new Worker(workerUrl)
		this.worker.onmessage = event => {this.acceptResults(event.data)}
		this.pinger()
	}

	acceptResults(results: string[]): void {
		this.count += 1
		for (const result of results) console.log(`physics worker result #${this.count}`, result)
	}
}
