/**
 * A watcher monitors user input in the form of button presses.
 * The watcher keeps an up-to-date status dictionary for every watched input.
 * You provide the watcher with a `bindings` object, which maps your own alias strings to inputs that you'd like to watch.
 */
export default class Watcher {
    /** Up-to-date dictionary of status booleans by alias. This stores the current status of a given input. */
    status: {
        [alias: string]: boolean;
    };
    /** Dictionary of aliases to inputs. */
    protected bindings: Bindings;
    /** Array of listeners that are called whenever a status changes. */
    protected listenerBindings: {
        alias: string;
        listener: Listener;
    }[];
    /**
     * Create a watcher which monitors user inputs (keyboard/mouse).
     */
    constructor({bindings}: WatcherOptions);
    /**
     * Start watching keyboard activity, by adding event listeners.
     */
    start(): void;
    /**
     * Stop watching keyboard activity, by removing event listeners.
     */
    stop(): void;
    /**
     * Assign a listener to an input change.
     */
    on(alias: string, listener: Listener): void;
    /**
     * Remove a single listener, or clear all of an input's listener.
     * Provide a listener to remove that one specifically.
     * Omit the listener to clear all listeners from that input.
     */
    off(alias: string, listener?: Listener): void;
    /**
     * Trigger a listener.
     */
    trigger(alias: string, status: boolean): void;
    /**
     * Internal watcher handling for the moment that a key is struck.
     * Set the input's status to true.
     */
    protected keydown: (event: KeyboardEvent) => void;
    /**
     * Internal watcher handling for the moment that a key is released.
     * Set the input's status to false.
     */
    protected keyup: (event: KeyboardEvent) => void;
    /**
     * Given a key code, return the input (or null if no match).
     */
    protected getInputByKeyCode(keyCode: number): Input;
    /**
     * Given an input, return the alias.
     */
    protected getAliasForInput(input: Input): string;
    /**
     * Destruct this watcher.
     */
    destructor(): void;
}
/**
 * Options for creating a new Watcher instance.
 */
export interface WatcherOptions {
    /**
     * Aliases for the inputs you'd like to watch.
     * Example, bindings: {'jump': Input.Space, 'crouch': Input.Ctrl}
     */
    bindings: Bindings;
}
/**
 * Watcher inputs.
 * These are all of the inputs that the watcher is capable to report about.
 */
export declare enum Input {
    One = 0,
    Two = 1,
    Three = 2,
    Four = 3,
    Five = 4,
    Six = 5,
    Seven = 6,
    Eight = 7,
    Nine = 8,
    Zero = 9,
    Shift = 10,
    Ctrl = 11,
    Alt = 12,
    Space = 13,
    W = 14,
    A = 15,
    S = 16,
    D = 17,
    Q = 18,
    E = 19,
}
/**
 * Dictionary of alias strings to inputs.
 */
export declare type Bindings = {
    [alias: string]: Input;
};
/**
 * Array of relationships between inputs and keycodes.
 */
export declare const inputKeyCodeRelationships: {
    input: Input;
    code: number;
}[];
/**
 * Listener callback which is given an input report (containing a status boolean) when it's called.
 */
export declare type Listener = (report: InputReport) => void;
/**
 * Report that input listeners receive whenever an input's status changes.
 */
export interface InputReport {
    input: Input;
    status: boolean;
}
