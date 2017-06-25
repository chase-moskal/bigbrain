define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Standard logging unit, just writes to the console.
     * Useful for writing warnings or interesting debug information.
     */
    class Logger {
        /**
         * Log a message to the console.
         */
        log(...messages) {
            console.log.apply(console, messages);
        }
        /**
         * Write a warning to the console.
         */
        warn(...messages) {
            console.warn.apply(console, messages);
        }
    }
    exports.default = Logger;
    /**
     * Disabled logger that doesn't do anything with the log messages.
     */
    class DisabledLogger extends Logger {
        /**
         * Disabled log function that does nothing.
         */
        log(...messages) { }
        /**
         * Disabled log function that does nothing.
         */
        warn(...messages) { }
    }
    exports.DisabledLogger = DisabledLogger;
});
//# sourceMappingURL=Logger.js.map