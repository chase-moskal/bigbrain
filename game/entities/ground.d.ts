import { Context } from "../game-interfaces";
import { Entity } from "../../core/entity";
import { StateEntry } from "../../core/interfaces";
export interface GroundEntry extends StateEntry {
    type: "Ground";
}
export declare class Ground extends Entity<Context, GroundEntry> {
    constructor(o: any);
    initialize(): Promise<void>;
    private loadGround;
    deconstruct(): Promise<void>;
}
