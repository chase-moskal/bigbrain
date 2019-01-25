import babylon from "../../../babylon";
import { Entity } from "../../../core/entity";
import { TickInfo } from "../../../core/interfaces";
import { Context } from "../../game-interfaces";
import { EditorEntry } from "./editor-interfaces";
export declare class Editor extends Entity<Context, EditorEntry> {
    readonly camera: babylon.TargetCamera;
    private readonly plugins;
    private readonly hyperPlugins;
    private readonly menu;
    private laserDot;
    private reactions;
    initialize(): Promise<void>;
    logicTick(tickInfo: TickInfo): void;
    hyperTick(tickInfo: TickInfo): void;
    deconstruct(): Promise<void>;
    private middlePick;
}
