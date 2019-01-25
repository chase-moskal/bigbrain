(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./toolbox/get-time"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const get_time_1 = require("./toolbox/get-time");
    /**
     * Default ticker option values
     */
    const defaultTickerOptions = {
        start: true,
        period: 10
    };
    /**
     * Ticker looping mechanism
     * - create a ticking loop with start/stop controls
     * - keep a consistent timeline (does not increase when paused)
     * - subscribe and unsubscribe new tick action functions
     * - record stats to the stat store
     */
    class Ticker {
        constructor(opts) {
            this.tickRate = 0;
            this.timeline = 0;
            this.active = false;
            this.lastTime = get_time_1.getTime();
            this.records = [];
            const options = Object.assign({}, defaultTickerOptions, opts);
            this.tickAction = options.tickAction;
            this.period = options.period;
            if (options.start)
                this.start();
        }
        /**
         * Destruct this ticker
         */
        deconstruct() {
            this.tickAction = null;
            this.records = [];
            this.stop();
        }
        /**
         * Start or resume ticking
         */
        start() {
            if (this.active)
                return;
            else {
                this.active = true;
                this.lastTime = get_time_1.getTime();
                console.log(this.period);
                this.interval = setInterval(() => this.loop(), this.period);
            }
        }
        /**
         * Stop the ticker
         */
        stop() {
            clearInterval(this.interval);
            this.interval = undefined;
            this.active = false;
        }
        /**
         * Internal ticker loop
         */
        loop() {
            if (!this.active)
                return;
            // gather time data
            const currentTime = get_time_1.getTime();
            const timeSinceLastTick = currentTime - this.lastTime;
            // record stats
            this.timeline += timeSinceLastTick;
            this.tickRate = this.calculateTickRate(timeSinceLastTick);
            // call tick action
            this.tickAction({
                timeSinceLastTick,
                timeline: this.timeline
            });
            // gather 'after' timings
            this.lastTime = currentTime;
            // // recurse, but give the browser some time to relax
            // setTimeout(() => {
            // 	if (environment === "browser")
            // 		window.requestAnimationFrame(() => this.loop())
            // 	else
            // 		this.loop()
            // }, this.durationBetweenTicks)
        }
        /**
         * Calculate the tick rate
         */
        calculateTickRate(timeSinceLastTick) {
            this.records.unshift(timeSinceLastTick);
            while (this.records.length > 20)
                this.records.pop();
            const sum = this.records.reduce((a, b) => a + b, 0);
            const averageTimePerTick = sum / this.records.length;
            return 1000 / averageTimePerTick;
        }
    }
    exports.Ticker = Ticker;
});
//# sourceMappingURL=ticker.js.map