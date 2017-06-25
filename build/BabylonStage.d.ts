import Stage, { RenderInfo } from 'Susa/Stage';
import BabylonLoader from 'Susa/BabylonLoader';
/**
 * Govern a 3D Babylon scene from a high level.
 * An access point to key Babylon API components for controlling the 3D scene.
 */
export default class BabylonStage extends Stage {
    /** HTML element which contains the game's rendering canvas. */
    readonly hostElement: HTMLElement;
    /** Canvas HTML element which the game renders to. */
    readonly canvas: HTMLCanvasElement;
    /** Babylon engine instance. */
    readonly engine: BABYLON.Engine;
    /** Babylon scene instance. */
    readonly scene: BABYLON.Scene;
    /** Utility to load assets into the Babylon scene. */
    readonly loader: BabylonLoader;
    /** Information about where the user's mouse cursor is hovering in the 3D scene. Updated on mousemove by the stage. */
    pick: BABYLON.PickingInfo;
    /** For measuring the time between frames. */
    private lastRenderTime;
    /** Event listeners that start and stop with the stage. */
    private listeners;
    /**
     * Accept stage options and initialize the stage's babylon components.
     */
    constructor(options: BabylonStageOptions);
    /**
     * Add all stage listeners to the document.
     * Start the Babylon rendering loop.
     */
    start(): void;
    /**
     * Stop the Babylon rendering loop.
     * Remove all stage listeners from the document.
     */
    stop(): void;
    /**
     * Render a frame.
     */
    protected render(info: RenderInfo): void;
}
/**
 * Options for creating a new stage.
 */
export interface BabylonStageOptions {
    /** HTML element to inject the canvas within. */
    hostElement: HTMLElement;
}
