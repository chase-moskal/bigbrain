import { GameOptions } from "./game-interfaces";
import { Manager } from "../core/manager";
import { Service } from "../core/toolbox/toolbox-interfaces";
import { ServiceMaster } from "../core/toolbox/service-master";
/**
 * Standard monarch game
 */
export declare class Game extends ServiceMaster implements Service {
    readonly manager: Manager;
    constructor(options: GameOptions);
    private makeTickers;
}
