import { ViewportOptions } from "./interfaces";
import { Service } from "./toolbox/toolbox-interfaces";
/**
 * Scene rendering and input manager
 *  - manage the babylon rendering loop (start/stop methods)
 *  - html dom event handling for pointer locking
 */
export declare class Viewport implements Service {
    private readonly scene;
    private readonly engine;
    private readonly window;
    private readonly canvas;
    private active;
    private readonly fallbackCamera;
    private pick;
    private lastFrameTime;
    private locked;
    renderFrameRate: number;
    private readonly listeners;
    constructor({ engine, scene, window, canvas, start }: ViewportOptions);
    start(): void;
    stop(): void;
    deconstruct(): void;
}
