import babylon from "../babylon";
import { Manager } from "./manager";
import { Network } from "./network/network";
import { Entity, GenericEntity } from "./entity";
import { StatisticsStore } from "./overlay/stores/statistics-store";
export declare enum ModeOfConduct {
    Alone = 0,
    Host = 1,
    Client = 2
}
export interface StandardContext {
    readonly mode: ModeOfConduct;
    readonly manager: Manager;
    readonly network: Network;
}
export interface ViewportOptions {
    scene: babylon.Scene;
    engine: babylon.Engine;
    window: Window;
    canvas: HTMLCanvasElement;
    start?: boolean;
}
export interface ConductorOptions<AdditionalContext = any> {
    mode: ModeOfConduct;
    entityClasses: EntityClasses;
    context?: AdditionalContext;
}
export interface ReplicateParams {
    state: State;
    context: StandardContext;
    entityClasses: EntityClasses;
    entities: Map<string, Entity>;
}
export interface EntityOptions<gContext = any> {
    id: string;
    context: gContext;
    state: State;
}
export declare type EntityClasses = {
    [name: string]: typeof GenericEntity;
};
export interface EntityPlugin {
    logic(tick: TickInfo): void;
    destructor(): void;
}
export interface StateEntry {
    readonly type: string;
}
export declare type StateEntries = Map<string, StateEntry>;
export interface State {
    entries: StateEntries;
}
export interface Message {
    readonly to: string;
}
export interface Update {
    messages: Message[];
    allEntries?: {
        [id: string]: StateEntry;
    };
    someEntries?: {
        [id: string]: StateEntry;
    };
}
export declare type Vector = [number, number, number];
export declare type Quaternion = [number, number, number, number];
export declare const VectorZero: Vector;
export declare const QuaternionZero: Quaternion;
/**
 * Spatial relationship with the world
 */
export interface Bearings {
    position: Vector;
    rotation: Quaternion;
}
/**
 * Physical characteristics
 */
export interface Physique {
    mass: number;
    size: Vector;
    friction?: number;
    damping?: number;
    restitution?: number;
}
/**
 * Information about each tick
 */
export interface TickInfo {
    /**
     * Elapsed milliseconds of ticker activity (not counting stopped time)
     */
    timeline: number;
    /**
     * How many milliseconds occurred since the previous tick (not counting stopped time)
     */
    timeSinceLastTick: number;
}
/**
 * Function called each tick
 */
export declare type TickAction = (tick: TickInfo) => void;
/**
 * Options to create a ticker
 */
export interface TickerOptions {
    /** Function called each tick */
    tickAction: TickAction;
    /** Store to record statistics onto */
    tickerStatStore?: StatisticsStore;
    /** Initialize with the ticker running */
    start?: boolean;
    /** Duration in milliseconds between each tick */
    period?: number;
}
