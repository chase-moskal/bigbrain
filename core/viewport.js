(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../babylon", "./toolbox/get-time"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../babylon");
    const get_time_1 = require("./toolbox/get-time");
    /**
     * Scene rendering and input manager
     *  - manage the babylon rendering loop (start/stop methods)
     *  - html dom event handling for pointer locking
     */
    class Viewport {
        constructor({ engine, scene, window, canvas, start = true }) {
            this.active = false;
            this.pick = new babylon_1.default.PickingInfo();
            this.lastFrameTime = get_time_1.getTime();
            this.locked = false;
            this.renderFrameRate = 0;
            this.listeners = {
                resize: () => {
                    this.engine.resize();
                },
                mousemove: () => {
                    this.pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                },
                pointerlockchange: () => {
                    if (this.scene.activeCamera) {
                        const locked = (this.window.document.pointerLockElement === this.canvas);
                        this.locked = locked;
                    }
                }
            };
            canvas.onclick = () => canvas.requestPointerLock();
            const fallbackCamera = new babylon_1.default.Camera("viewport.fallback.camera", new babylon_1.default.Vector3(0, 1, -15), scene);
            if (!scene.activeCamera)
                scene.activeCamera = fallbackCamera;
            Object.assign(this, { engine, scene, window, canvas, fallbackCamera });
            if (start)
                this.start();
        }
        start() {
            const { window, listeners, engine, scene } = this;
            this.active = true;
            window.addEventListener("resize", listeners.resize);
            window.addEventListener("mousemove", listeners.mousemove);
            window.document.addEventListener("pointerlockchange", listeners.pointerlockchange);
            engine.runRenderLoop(() => {
                if (!this.active)
                    return null;
                const since = get_time_1.getTime() - this.lastFrameTime;
                scene.render();
                this.lastFrameTime = get_time_1.getTime();
                this.renderFrameRate = engine.getFps();
            });
        }
        stop() {
            const { window, listeners, engine } = this;
            this.active = false;
            this.renderFrameRate = 0;
            window.removeEventListener("resize", listeners.resize);
            window.removeEventListener("mousemove", listeners.mousemove);
            window.document.removeEventListener("pointerlockchange", listeners.pointerlockchange);
            engine.stopRenderLoop();
        }
        deconstruct() { }
    }
    exports.Viewport = Viewport;
});
//# sourceMappingURL=viewport.js.map