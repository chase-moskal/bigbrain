import { Entity } from "../../core/entity";
import { Context } from "../game-interfaces";
import { StateEntry } from "../../core/interfaces";
export interface TerrainEntry extends StateEntry {
    type: "Terrain";
}
export declare class Terrain extends Entity<Context, TerrainEntry> {
    initialize(): Promise<void>;
    deconstruct(): Promise<void>;
    private load;
    private generateLighting;
    private generateTerrain;
    private loadTerrainObjectFile;
}
