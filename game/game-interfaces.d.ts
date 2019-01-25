import babylon from "../babylon";
import * as cannon from "cannon";
import { MainMenuStore } from "../core/overlay/stores/main-menu-store";
import { OverlayStore } from "../core/overlay/stores/overlay-store";
import { StandardContext, ConductorOptions } from "../core/interfaces";
export interface GameContext {
    window: Window;
    scene: babylon.Scene;
    engine: babylon.Engine;
    canvas: HTMLCanvasElement;
    physicsWorld: cannon.World;
    overlayStore: OverlayStore;
    mainMenuStore: MainMenuStore;
}
export declare type Context = StandardContext & GameContext;
export interface GameOptions extends ConductorOptions {
    maxSlowTickRate: number;
    maxLogicTickRate: number;
    maxHyperTickRate: number;
    canvas: HTMLCanvasElement;
    overlayElement: HTMLDivElement;
    gravity: [number, number, number];
}
