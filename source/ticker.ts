
import {Service, now, environment} from "./toolbox"

/**
 * Information about each tick
 */
export interface TickInfo {

	/**
	 * Elapsed milliseconds of ticker activity (not counting stopped time)
	 */
	timeline: number

	/**
	 * How many milliseconds occurred since the previous tick (not counting stopped time)
	 */
	timeSinceLastTick: number
}

/**
 * Function called each tick
 */
export type TickAction = (tick: TickInfo) => void

/**
 * Options to create a ticker
 */
export interface TickerOptions {

	/** Function called each tick */
	tickAction: TickAction

	/** Duration in milliseconds between each tick */
	durationBetweenTicks?: number
}

/**
 * Default ticker option values
 */
const defaultTickerOptions: Partial<TickerOptions> = {
	durationBetweenTicks: 10
}

/**
 * Ticker looping mechanism
 * - create a ticking loop with start/stop controls
 * - keep a consistent timeline (does not increase when paused)
 * - subscribe and unsubscribe new tick action functions
 */
export class Ticker implements Service {
	private timeline: number = 0
	private tickAction: TickAction
	private durationBetweenTicks: number
	private active = false
	private lastTime = now()

	constructor(opts: TickerOptions) {
		Object.assign(this, {...defaultTickerOptions, ...opts})
	}

	/**
	 * Destruct this ticker
	 */
	destructor() {
		this.tickAction = null
		this.stop()
	}

	/**
	 * Start or resume ticking
	 */
	start() {
		if (this.active) return
		else {
			this.active = true
			this.lastTime = now()
			this.loop()
		}
	}

	/**
	 * Stop the ticker
	 */
	stop() {
		this.active = false
	}

	/**
	 * Internal ticker loop
	 */
	private loop() {
		if (!this.active) return

		// gather 'start' timings
		const startTime = now()
		const timeSinceLastTick = startTime - this.lastTime
		this.timeline += timeSinceLastTick

		// call tick action
		this.tickAction({
			timeSinceLastTick,
			timeline: this.timeline
		})

		// gather 'after' timings
		this.lastTime = now()

		// recurse, but give the browser some time to relax
		setTimeout(() => {
			if (environment === "browser")
				window.requestAnimationFrame(() => this.loop())
			else
				this.loop()
		}, this.durationBetweenTicks)
	}
}
