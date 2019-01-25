import { Manager } from "./manager";
import { TickInfo, ConductorOptions } from "./interfaces";
export declare class Conductor<AdditionalContext extends Object = Object> {
    readonly manager: Manager;
    private readonly entities;
    constructor({ entityClasses, context: moreContext }: ConductorOptions<AdditionalContext>);
    logicTick(tickInfo: TickInfo): void;
    hyperTick(tickInfo: TickInfo): void;
    slowTick(tickInfo: TickInfo): void;
}
