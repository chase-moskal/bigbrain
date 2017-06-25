define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generic ticking loop, with start/stop controls.
     * Keeps a consistent timeline.
     */
    class Ticker {
        /**
         * Instantiate a ticker with an action function which will be called repeatedly.
         */
        constructor({ action, relax = 10 }) {
            /** Total ticker time. Does not increment when ticker is stopped. */
            this.timeline = 0;
            /** Timestamp of the previous tick. */
            this.lastTickTime = performance.now();
            /** Nifty statistics. */
            this.stats = {
                totalTicks: 0
            };
            this.action = action;
            this.relax = relax;
        }
        /**
         * Start the recursive ticking loop.
         */
        start() {
            // If the stop callback is set, call it, clear it, and stop the recursive ticking process by returning.
            if (this.stopTickingCallback) {
                this.stopTickingCallback();
                this.stopTickingCallback = null;
                return;
            }
            // Gather 'start' timings.
            let now = performance.now();
            const timeSinceLastTick = now - this.lastTickTime;
            this.timeline += timeSinceLastTick;
            const tickStartTime = now;
            // Call the tick action.
            this.action({
                timeSinceLastTick,
                timeline: this.timeline
            });
            // Gather 'after' timings.
            now = performance.now();
            this.lastTickTime = now;
            const tickTime = now - tickStartTime;
            ++this.stats.totalTicks;
            // Recurse, but give the browser some time to relax.
            setTimeout(() => {
                window.requestAnimationFrame(() => {
                    this.start();
                });
            }, this.relax);
        }
        /**
         * Halt the ticker.
         * Set the stop ticking callback, and use it to resolve the returned promise.
         */
        stop() {
            return new Promise((resolve, reject) => {
                this.stopTickingCallback = () => resolve();
            });
        }
    }
    exports.default = Ticker;
});
//# sourceMappingURL=Ticker.js.map