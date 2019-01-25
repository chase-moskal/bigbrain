import babylon from "../../babylon";
import { Manager } from "../../core/manager";
import { StickStore } from "../../core/overlay/stores/stick-store";
import { MainMenuStore } from "../../core/overlay/stores/main-menu-store";
import { RotatableNode, MovableNode } from "../tools/tools-interfaces";
export interface LookPluginOptions {
    node: RotatableNode;
    engine: babylon.Engine;
    stickStore: StickStore;
    mainMenuStore: MainMenuStore;
}
export interface MovePluginOptions {
    node: MovableNode;
    stickStore: StickStore;
}
export interface PropPluginOptions {
    manager: Manager;
    scene: babylon.Scene;
    canvas: HTMLCanvasElement;
}
