/**
 * Rendering stage.
 */
declare abstract class Stage {
    /** Nifty diagnostics. */
    readonly stats: {
        totalFrames: number;
    };
    /**
     * Render a frame.
     */
    protected render(info: RenderInfo): void;
    /** Start the rendering loop. */
    abstract start(): any;
    /** Stop the rendering loop. */
    abstract stop(): any;
}
export default Stage;
/**
 * Information passed for each rendered frame.
 */
export interface RenderInfo {
    /** Time since the last frame finished rendering. */
    since: number;
}
