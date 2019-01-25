import { Service } from "./toolbox/toolbox-interfaces";
import { TickerOptions } from "./interfaces";
/**
 * Ticker looping mechanism
 * - create a ticking loop with start/stop controls
 * - keep a consistent timeline (does not increase when paused)
 * - subscribe and unsubscribe new tick action functions
 * - record stats to the stat store
 */
export declare class Ticker implements Service {
    tickRate: number;
    timeline: number;
    private period;
    private tickAction;
    private active;
    private interval;
    private lastTime;
    private records;
    constructor(opts: TickerOptions);
    /**
     * Destruct this ticker
     */
    deconstruct(): void;
    /**
     * Start or resume ticking
     */
    start(): void;
    /**
     * Stop the ticker
     */
    stop(): void;
    /**
     * Internal ticker loop
     */
    private loop;
    /**
     * Calculate the tick rate
     */
    private calculateTickRate;
}
