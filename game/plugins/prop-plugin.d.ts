import babylon from "../../babylon";
import { Input } from "../../core/watcher/input";
import { TickInfo, EntityPlugin } from "../../core/interfaces";
import { PropPluginOptions } from "./plugins-interfaces";
export declare const bindings: {
    propose: Input[];
    place: Input[];
    remove: Input[];
};
export declare class PropPlugin implements EntityPlugin {
    private readonly watcher;
    private readonly manager;
    private readonly scene;
    private readonly canvas;
    private readonly propSpawnHeight;
    private proposedSize;
    private proposalMesh;
    constructor(options: PropPluginOptions);
    readonly aimpoint: babylon.Vector3;
    logic(tick: TickInfo): void;
    destructor(): void;
    private middlePick;
    private getRandomSize;
    private reactions;
}
