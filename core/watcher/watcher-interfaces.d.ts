import { Input } from "./input";
export interface InputKeycodeRelation {
    input: Input;
    code: number;
}
export interface InputReport {
    input: Input;
    status: boolean;
}
export declare type Bindings = {
    [alias: string]: Input[];
};
export declare type Status<gBindings extends Bindings = Bindings> = {
    [P in keyof gBindings]: boolean;
};
export interface WatcherOptions<gBindings extends Bindings = Bindings> {
    eventTarget?: EventTarget;
    bindings: gBindings;
}
