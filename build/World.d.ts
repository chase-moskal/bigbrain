import Game from 'Susa/Game';
import Logger from 'Susa/Logger';
import BabylonStage from 'Susa/Stage';
import Entity, { EntityData } from 'Susa/Entity';
/**
 * World is an entity management system.
 *  - Contain collection of entity instances.
 *  - Logic routine where entities imitate the game state.
 *  - Responsible for dynamically loading and instancing entities.
 */
export default class World {
    /** Collection of entity instances. */
    readonly entities: {
        [id: string]: Entity;
    };
    /** Logger for world events. */
    private readonly logger;
    /** Parent game instance, passed to summoned entities. */
    private readonly game;
    /** Stage for rendering the scene. */
    private readonly stage;
    /**
     * Construct a world instance.
     */
    constructor(options: WorldOptions);
    /**
     * Destruct all entities and shut down.
     * This allows all event bindings and such to be cleaned up.
     */
    destructor(): Promise<void>;
    /**
     * Get an array of all entity ids.
     */
    getEntityIds(): string[];
    /**
     * Get an entity instance by its ID.
     */
    getEntity(id: string): Entity;
    /**
     * Get an array of all entities.
     */
    getEntities(): Entity[];
    /**
     * Query for entities by searching through their tags.
     */
    query(terms?: (string | RegExp)[]): Entity[];
    /**
     * Dynamically load up and instantiate an entity, based on a given id and entity state object.
     */
    summonEntity(id: string, data: EntityData): Promise<Entity>;
    /**
     * Destruct and remove an entity instance from the game world.
     */
    banishEntity(id: string): Promise<void>;
}
/**
 * Options to create a world.
 */
export interface WorldOptions {
    logger: Logger;
    game: Game;
    stage: BabylonStage;
}
