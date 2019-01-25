import { Message, TickInfo, StateEntry, EntityOptions, StandardContext } from "./interfaces";
export declare abstract class Entity<gContext extends StandardContext = StandardContext, gStateEntry extends StateEntry = StateEntry> {
    readonly id: string;
    inbox: Message[];
    protected readonly context: gContext;
    private readonly state;
    constructor(options: EntityOptions<gContext>);
    readonly entry: gStateEntry;
    abstract initialize(): Promise<void>;
    abstract deconstruct(): Promise<void>;
    logicTick(tick: TickInfo): void;
    hyperTick(tick: TickInfo): void;
    slowTick(tick: TickInfo): void;
}
export declare class GenericEntity extends Entity {
    initialize(): Promise<void>;
    deconstruct(): Promise<void>;
}
