import { Entity } from "./entity";
import { StateEntry } from "./interfaces";
/**
 * State manager
 *  - public access to administrative game functions
 *  - entities have access to this via context
 */
export declare class Manager {
    private readonly state;
    private readonly entities;
    constructor({ state, entities }: {
        state: any;
        entities: any;
    });
    getEntities(): Entity[];
    addEntry<T extends StateEntry = StateEntry>(entry: T): string;
    removeEntry(id: string): void;
}
