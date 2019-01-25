import { Bindings, WatcherOptions, Status } from "./watcher-interfaces";
export declare class Watcher<gBindings extends Bindings = Bindings> {
    private readonly eventTarget;
    private readonly bindings;
    readonly status: Status<gBindings>;
    constructor({ eventTarget, bindings }: WatcherOptions<gBindings>);
    private readonly listeners;
    start(): void;
    stop(): void;
    destructor(): void;
    private getInputByKeycode;
    private getAliasesForInput;
}
