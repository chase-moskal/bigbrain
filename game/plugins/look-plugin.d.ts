import { TickInfo, EntityPlugin } from "../../core/interfaces";
import { LookPluginOptions } from "./plugins-interfaces";
export declare class LookPlugin implements EntityPlugin {
    private readonly freelook;
    private readonly node;
    private readonly engine;
    private readonly stickStore;
    private readonly mainMenuStore;
    constructor({ engine, node, stickStore, mainMenuStore }: LookPluginOptions);
    logic(tick: TickInfo): void;
    destructor(): void;
    private getSensitivity;
    private eventHandlers;
    private ascertainThumblook;
    private enactLook;
}
