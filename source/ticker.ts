
import {Service, now, environment} from "./toolbox"

/**
 * Ticker class
 *  - create a ticking loop with start/stop controls
 *  - keep a consistent timeline (doesn't progress when paused)
 */
export class Ticker implements Service {
	private timeline: number = 0
	private actions: TickAction[] = []
	private relax: number
	private stoppage = false
	private lastTime = now()

	constructor({tickAction, durationBetweenTicks = 10}: TickerOptions = {}) {
		if (tickAction) this.actions.push(tickAction)
		this.relax = durationBetweenTicks
	}

	subscribe(action: TickAction) {
		this.actions.push(action)
	}

	clear() {
		this.actions = []
	}

	destructor() {
		this.stop()
		this.clear()
	}

	start() {

		// handle stoppage
		if (this.stoppage) {
			this.stoppage = false
			return
		}

		// gather 'start' timings
		const startTime = now()
		const timeSinceLastTick = startTime - this.lastTime
		this.timeline += timeSinceLastTick

		// call actions
		for (const action of this.actions)
			action({
				timeSinceLastTick,
				timeline: this.timeline
			})

		// gather 'after' timings
		this.lastTime = now()

		// recurse, but give the browser some time to relax
		setTimeout(() => {
			if (environment === "browser")
				window.requestAnimationFrame(() => this.start())
			else
				this.start()
		}, this.relax)
	}

	stop() {
		this.stoppage = true
	}
}

export interface TickInfo {
	timeline: number
	timeSinceLastTick: number
}

export type TickAction = (tick: TickInfo) => void

export interface TickerOptions {

	/** functon called on each tick */
	tickAction?: TickAction

	/** duration in milliseconds */
	durationBetweenTicks?: number
}
