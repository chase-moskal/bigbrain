
import {now, environment} from "./toolbox"

/**
 * Package of information that is passed along with each tick action
 */
export interface Tick {

  /** Total place along ticker's timeline, which effectively freezes on stop() and resumes on start() */
  timeline: number

  /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds */
  timeSinceLastTick: number
}

/**
 * Action to take when a tick occurs
 * A function that is called repeatedly, for each tick
 */
export type TickAction = (tick: Tick) => void

/**
 * Options for instantiating a new ticker
 */
export interface TickerOptions {

  /** Time period between ticks */
  relax?: number
}

/**
 * Ticking loop with start/stop controls
 *  - keep a consistent timeline
 */
export default class Ticker {

  /** Total ticker time. Does not increment when ticker is stopped */
  private timeline: number = 0

  /** Actions to be called for every tick while the ticker is running */
  private actions: TickAction[] = []

  /** Period of time to relax in between ticks */
  private relax: number

  /** The presence of this callback function is the indicator to stop ticking */
  private stopCallback: () => void

  /** Timestamp of the previous tick */
  private lastTime = now()

  /**
   * Instantiate a ticker with an action function which will be called repeatedly
   */
  constructor({relax = 10}: TickerOptions = {}) {
    this.relax = relax
  }

  /**
   * Subscribe an action function
   */
  subscribe(action: TickAction) {
    this.actions.push(action)
  }

  /**
   * Clear all action function subscriptions
   */
  clear() {
    this.actions = []
  }

  /**
   * Start the recursive ticking loop
   */
  start() {

    // if the stop callback is set, call it, clear it, and stop the recursive
    // ticking process by returning
    if (this.stopCallback) {
      this.stopCallback()
      this.stopCallback = null
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

  /**
   * Halt the ticker
   * Set the stop ticking callback, and use it to resolve the returned promise
   */
  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.stopCallback = () => resolve()
    })
  }
}
