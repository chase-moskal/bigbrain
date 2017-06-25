define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendering stage.
     */
    class Stage {
        constructor() {
            /** Nifty diagnostics. */
            this.stats = {
                totalFrames: 0
            };
        }
        /**
         * Render a frame.
         */
        render(info) {
            this.stats.totalFrames++;
        }
    }
    /** Export abstract class as default. */
    exports.default = Stage;
});
//# sourceMappingURL=Stage.js.map