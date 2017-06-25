import State from 'Susa/State';
import { EntityData } from 'Susa/Entity';
/**
 * World state is specialized for tracking entities.
 */
export default class WorldState extends State {
    /** Entity ID pulling station — get new IDs here. */
    private nextId;
    private readonly pullId;
    /** World state data. */
    protected data: WorldData;
    /**
     * Get an array of defined entity state ids.
     */
    getEntityIds(): string[];
    /**
     * Get an entity's state data.
     */
    getEntityData(id: string): EntityData;
    /**
     * Add an entity to state.
     */
    addEntity<T extends EntityData>(entityData: T): void;
    /**
     * Delete an entity from the state.
     */
    deleteEntity(id: string): void;
    /**
     * Getter for an array of all defined entities.
     */
    readonly entities: Object;
}
/**
 * Serializable description of a game world.
 */
export interface WorldData {
    /** Describe entities in the game world. */
    entities: {
        [id: string]: EntityData;
    };
}
