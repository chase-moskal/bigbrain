import { State, Message, Update, ModeOfConduct } from "../interfaces";
export declare abstract class Network {
    protected readonly mode: ModeOfConduct;
    protected readonly state: State;
    protected readonly handleMessages: (messages: Message[]) => void;
    constructor({ state, mode, handleMessages }: {
        mode: ModeOfConduct;
        state: State;
        handleMessages: (messages: Message[]) => void;
    });
    applyUpdate(update: Update): void;
    abstract send(update: Update): void;
}
