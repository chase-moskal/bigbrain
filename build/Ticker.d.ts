/**
 * Generic ticking loop, with start/stop controls.
 * Keeps a consistent timeline.
 */
export default class Ticker {
    /** Total ticker time. Does not increment when ticker is stopped. */
    private timeline;
    /** Action to be called for every tick while the ticker is running. */
    private action;
    /** Period of time to relax in between ticks. */
    private relax;
    /** The presence of this callback function is the indicator to stop ticking. It is called. */
    private stopTickingCallback;
    /** Timestamp of the previous tick. */
    private lastTickTime;
    /** Nifty statistics. */
    private stats;
    /**
     * Instantiate a ticker with an action function which will be called repeatedly.
     */
    constructor({action, relax}: TickerOptions);
    /**
     * Start the recursive ticking loop.
     */
    start(): void;
    /**
     * Halt the ticker.
     * Set the stop ticking callback, and use it to resolve the returned promise.
     */
    stop(): Promise<void>;
}
/**
 * Options for instantiating a new ticker.
 */
export interface TickerOptions {
    /** Function to be executed on each tick. */
    action: TickAction;
    /** Allowed relaxation period between ticks. */
    relax?: number;
}
/**
 * Action to take when a tick occurs.
 * A function that is called repeatedly, for each tick.
 */
export declare type TickAction = (tick: Tick) => void;
/**
 * Package of information that is passed along with each tick action.
 */
export interface Tick {
    /** Total place along ticker's timeline, which effectively freezes on stop() and resumes on start(). */
    timeline: number;
    /** Duration of time that has passed since the end of the last tick to the beginning of this tick, in milliseconds. */
    timeSinceLastTick: number;
}
