import { Service } from "./toolbox-interfaces";
export declare class ServiceMaster implements Service {
    protected services: Service[];
    deconstruct(): void;
    start(): void;
    stop(): void;
}
