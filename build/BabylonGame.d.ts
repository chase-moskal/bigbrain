import World from 'Susa/World';
import Logger from 'Susa/Logger';
import Network from 'Susa/Network';
import WorldState from 'Susa/WorldState';
import Game, { GameOptions } from 'Susa/Game';
import BabylonStage from 'Susa/BabylonStage';
/**
 * Game that is wired up for the babylon engine.
 */
export default class BabylonGame extends Game {
    /** Logging warnings and diagnostics to the console. */
    readonly logger: Logger;
    /** Stage which manages the babylon scene, rendering. */
    protected readonly stage: BabylonStage;
    /** State describes the entire game world, and is the serializable source-of-truth. */
    protected readonly state: WorldState;
    /** World manages entities. */
    protected readonly world: World;
    /** Manages connections and streams game state patches and entity messages. */
    protected readonly network: Network;
    /**
     * Construct the babylon game with options.
     */
    constructor(options: BabylonGameOptions);
    /**
     * Shut down the game.
     * Destruct all entities, cleanup event handlers, etc.
     */
    destructor(): Promise<void>;
    /**
     * Return the current rendering framerate (frames per second).
     */
    getFrameRate(): number;
    /**
     * Return the current logic tick rate (ticks per second).
     */
    getTickRate(): number;
}
/**
 * Options for creating a babylon game instance.
 */
export interface BabylonGameOptions extends GameOptions {
    /** Babylon stage to use. */
    stage?: BabylonStage;
    /** Host element used by the default stage. If `stage` is provided, this `hostElement` option is ignored. */
    hostElement?: HTMLElement;
}
