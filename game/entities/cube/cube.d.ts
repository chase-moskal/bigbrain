import { Entity } from "../../../core/entity";
import { Context } from "../../game-interfaces";
import { TickInfo } from "../../../core/interfaces";
import { CubeEntry } from "./cube-interfaces";
export declare class Cube extends Entity<Context, CubeEntry> {
    private static assets;
    private reactions;
    private meshes;
    initialize(): Promise<void>;
    logicTick(tickInfo: TickInfo): void;
    deconstruct(): Promise<void>;
    private loadAssets;
    private instanceAssets;
    private establishReactions;
    private last;
    private isTooSoon;
    private updateState;
}
