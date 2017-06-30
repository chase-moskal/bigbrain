
import {now, environment} from "./toolbox"

/**
 * Generic ticking loop, with start/stop controls.
 * Keeps a consistent timeline.
 */
export default class Ticker {

  /** Total ticker time. Does not increment when ticker is stopped. */
  private timeline: number = 0

  /** Action to be called for every tick while the ticker is running. */
  private action: TickAction

  /** Period of time to relax in between ticks. */
  private relax: number

  /** The presence of this callback function is the indicator to stop ticking. It is called. */
  private stopTickingCallback: () => void

  /** Timestamp of the previous tick. */
  private lastTickTime = now()

  /**
   * Instantiate a ticker with an action function which will be called repeatedly.
   */
  constructor({action, relax = 10}: TickerOptions) {
    this.action = action
    this.relax = relax
  }

  /**
   * Start the recursive ticking loop.
   */
  start() {

    // If the stop callback is set, call it, clear it, and stop the recursive ticking process by returning.
    if (this.stopTickingCallback) {
      this.stopTickingCallback()
      this.stopTickingCallback = null
      return
    }

    // Gather 'start' timings.
    const tickStartTime = now()
    const timeSinceLastTick = tickStartTime - this.lastTickTime
    this.timeline += timeSinceLastTick

    // Call the tick action.
    this.action({
      timeSinceLastTick,
      timeline: this.timeline
    })

    // Gather 'after' timings.
    this.lastTickTime = now()
    const tickTime = this.lastTickTime - tickStartTime

    // Recurse, but give the browser some time to relax.
    setTimeout(() => {
      if (environment === "browser") 
        window.requestAnimationFrame(() => {
          this.start()
        })
      else {
        this.start()
      }
    }, this.relax)
  }

  /**
   * Halt the ticker.
   * Set the stop ticking callback, and use it to resolve the returned promise.
   */
  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.stopTickingCallback = () => resolve()
    })
  }
}

/**
 * Options for instantiating a new ticker.
 */
export interface TickerOptions {

  /** Function to be executed on each tick. */
  action: TickAction

  /** Allowed relaxation period between ticks. */
  relax?: number
}

/**
 * Action to take when a tick occurs.
 * A function that is called repeatedly, for each tick.
 */
export type TickAction = (tick: Tick) => void

/**
 * Package of information that is passed along with each tick action.
 */
export interface Tick {

  /** Total place along ticker's timeline, which effectively freezes on stop() and resumes on start(). */
  timeline: number

  /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds. */
  timeSinceLastTick: number
}
