import { ThumbstickInfo, ThumbstickOptions } from "./tools-interfaces";
export declare class Thumbstick {
    info: ThumbstickInfo;
    private manager;
    constructor({ zone, onMove }: ThumbstickOptions);
    destructor(): void;
}
