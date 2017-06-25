import Stage from 'Susa/Stage';
import World from 'Susa/World';
import Logger from 'Susa/Logger';
import Network from 'Susa/Network';
import WorldState from 'Susa/WorldState';
import Ticker, { Tick } from 'Susa/Ticker';
import { EntityData } from 'Susa/Entity';
/**
 * Generic game class.
 */
declare abstract class Game {
    /** Network streams patches and messages, and handles connections. */
    protected readonly abstract network: Network;
    /** Ticker is the heartbeat of the game, which actuates the mainloop. */
    protected readonly ticker: Ticker;
    /** State stores and manages game data. */
    protected readonly abstract state: WorldState;
    /** World manages entities. */
    protected readonly abstract world: World;
    /** Stage for scene rendering. */
    protected readonly abstract stage: Stage;
    /** Logger writes to the console. */
    protected readonly abstract logger: Logger;
    /**
     * Construct a new game.
     */
    constructor(options: GameOptions);
    /**
     * Shut down.
     * Destruct all entities, cleanup event handlers, etc.
     */
    abstract destructor(): Promise<void>;
    /**
     * Return the current rendering framerate (frames per second).
     */
    abstract getFrameRate(): number;
    /**
     * Return the current logic tick rate (ticks per second).
     */
    abstract getTickRate(): number;
    /**
     * Start the game world.
     */
    start(): void;
    /**
     * Stop the game world.
     */
    stop(): Promise<void>;
    /**
     * Add an entity to the game based on the provided entity state.
     * TODO: Make this resolve a promise of the true Entity instance within the World.
     */
    addEntity<T extends EntityData>(entityData: T): void;
    /**
     * Remove an entity from the state based on the provided entity id.
     * TODO: Make this resolve a promise that is resolved when the entity instance is actually removed from the world.
     */
    removeEntity(id: string): void;
    /**
     * Main game routine.
     */
    protected mainloop(tick: Tick): void;
    /**
     * Synchronize the world to match the state.
     *  - Add/remove world entities to reflect state.
     *  - Update entity data and deliver messages to inboxes.
     *  - Return a promised report.
     */
    private sync(messages);
    /**
     * Entity logic routine.
     */
    private logic(tick);
}
export default Game;
/**
 * Options for constructing a game.
 */
export interface GameOptions {
    stage?: Stage;
    world?: World;
    logger?: Logger;
    ticker?: Ticker;
    network?: Network;
    state?: WorldState;
}
