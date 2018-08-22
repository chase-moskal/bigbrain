
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

	/** Initialize with the ticker running */
	start?: boolean

	/** Duration in milliseconds between each tick */
	durationBetweenTicks?: number
}

/**
 * Default ticker option values
 */
const defaultTickerOptions: Partial<TickerOptions> = {
	start: true,
	durationBetweenTicks: 10
}

/**
 * Ticker looping mechanism
 * - create a ticking loop with start/stop controls
 * - keep a consistent timeline (does not increase when paused)
 * - subscribe and unsubscribe new tick action functions
 */
export class Ticker implements Service {
	tickRate = 0

	private timeline: number = 0
	private durationBetweenTicks: number

	private tickAction: TickAction
	private active = false
	private lastTime = now()
	private records: number[] = []

	constructor(opts: TickerOptions) {
		const options = {...defaultTickerOptions, ...opts}
		this.tickAction = options.tickAction
		this.durationBetweenTicks = options.durationBetweenTicks
		if (options.start) this.start()
	}

	/**
	 * Destruct this ticker
	 */
	destructor() {
		this.tickAction = null
		this.records = []
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
	 * Calculate the tick rate
	 */
	private calculateTickRate(timeSinceLastTick: number): number {
		this.records.unshift(timeSinceLastTick)
		while (this.records.length > 10) this.records.pop()
		const sum = this.records.reduce((a, b) => a + b, 0)
		const averageTimePerTick = sum / this.records.length
		return 1000 / averageTimePerTick
	}

	/**
	 * Internal ticker loop
	 */
	private loop() {
		if (!this.active) return

		// gather time data
		const currentTime = now()
		const timeSinceLastTick = currentTime - this.lastTime

		// record some stats
		this.timeline += timeSinceLastTick
		this.tickRate = this.calculateTickRate(timeSinceLastTick)

		// call tick action
		this.tickAction({
			timeSinceLastTick,
			timeline: this.timeline
		})

		// gather 'after' timings
		this.lastTime = currentTime

		// recurse, but give the browser some time to relax
		setTimeout(() => {
			if (environment === "browser")
				window.requestAnimationFrame(() => this.loop())
			else
				this.loop()
		}, this.durationBetweenTicks)
	}
}
