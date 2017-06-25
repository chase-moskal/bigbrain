import Game from 'Susa/Game';
import World from 'Susa/World';
import Stage from 'Susa/Stage';
import Logger from 'Susa/Logger';
import { Tick } from 'Susa/Ticker';
import WorldState from 'Susa/WorldState';
/**
 * Entity in the game world which responds to fresh entity state on logic ticks.
 * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
 */
declare abstract class Entity {
    /** Module ID for this entity class. Used to load entity classes on-the-fly. */
    static readonly type: string;
    /** Module ID for this entity class. Copied from the static variable. */
    readonly type: string;
    /** Unique ID tag. */
    readonly id: string;
    /** Searchable tag strings related to this entity. Optional. */
    readonly tags: string[];
    /** Immutable official data which describes this entity. */
    data: Object;
    /** Mutable local copy of entity data, serving to indicate changes to be sent over the network. */
    delta: Object;
    /** Incoming entity messages. */
    inbox: EntityMessage[];
    /** Outgoing entity messages. */
    outbox: EntityMessage[];
    /** Game instance. Entities can start/stop the game, add/remove entities, etc. */
    protected readonly game: Game;
    /** World instance. Entities can query for and access other entity instances. */
    protected readonly world: World;
    /** Stage instance. Entities can use the stage for rendering and to access Babylon components. */
    protected readonly stage: Stage;
    /** Simple logging utility. */
    protected readonly logger: Logger;
    /**
     * Create a new entity instance.
     * You can optionally provide your own label for each instance.
     */
    constructor(options: EntityOptions);
    /**
     * Clean up this entity for removal from the game.
     * Tear down any event subscriptions, etc.
     */
    destructor(): Promise<void>;
    worldStateDiff(state: WorldState): any;
    /**
     * Log formatting.
     */
    toString(): string;
    /**
     * Logic tick routine.
     * Respond to fresh entity state.
     */
    abstract logic(tick: Tick): void;
}
export default Entity;
/**
 * Options for creating an Entity.
 */
export interface EntityOptions {
    id: string;
    data: EntityData;
    tags?: string[];
    logger: Logger;
    game: Game;
    world: World;
    stage: Stage;
}
/**
 * Serializable networked message that messages can send to themselves.
 */
export interface EntityMessage {
    /** Sender and recipient of the message. You see, entities are always sending messages to themselves: they're trying to reach the version of themselves which is on the host machine. */
    entityId: string;
}
/**
 * Input for entity logic.
 */
export interface EntityLogicInput {
    tick: Tick;
}
/**
 * Entity's serializable, networkable, saveable state.
 */
export interface EntityData {
    type: string;
    tags: string[];
}
