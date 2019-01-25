import { TickInfo, EntityPlugin } from "../../core/interfaces";
import { MovePluginOptions } from "./plugins-interfaces";
export declare class MovePlugin implements EntityPlugin {
    private readonly node;
    private readonly stickStore;
    private readonly watcher;
    constructor({ node, stickStore }: MovePluginOptions);
    logic(tick: TickInfo): void;
    destructor(): void;
}
