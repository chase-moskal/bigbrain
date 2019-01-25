import { Network } from "./network";
import { Update } from "../interfaces";
export declare class LoopbackNetwork extends Network {
    send(update: Update): void;
}
