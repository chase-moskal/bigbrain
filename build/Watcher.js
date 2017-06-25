define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A watcher monitors user input in the form of button presses.
     * The watcher keeps an up-to-date status dictionary for every watched input.
     * You provide the watcher with a `bindings` object, which maps your own alias strings to inputs that you'd like to watch.
     */
    class Watcher {
        /**
         * Create a watcher which monitors user inputs (keyboard/mouse).
         */
        constructor({ bindings }) {
            /** Up-to-date dictionary of status booleans by alias. This stores the current status of a given input. */
            this.status = {};
            /** Dictionary of aliases to inputs. */
            this.bindings = {};
            /** Array of listeners that are called whenever a status changes. */
            this.listenerBindings = [];
            /**
             * Internal watcher handling for the moment that a key is struck.
             * Set the input's status to true.
             */
            this.keydown = (event) => {
                const struckInput = this.getInputByKeyCode(event.keyCode);
                if (!struckInput)
                    return;
                const struckAlias = this.getAliasForInput(struckInput);
                if (!struckAlias)
                    return;
                this.status[struckAlias] = true;
                this.trigger(struckAlias, true);
            };
            /**
             * Internal watcher handling for the moment that a key is released.
             * Set the input's status to false.
             */
            this.keyup = (event) => {
                const releasedInput = this.getInputByKeyCode(event.keyCode);
                if (!releasedInput)
                    return;
                const releasedAlias = this.getAliasForInput(releasedInput);
                if (!releasedAlias)
                    return;
                this.status[releasedAlias] = false;
                this.trigger(releasedAlias, false);
            };
            this.bindings = bindings;
            // Loop over the provided bindings and initialize the status dictionary for each input alias.
            Object.keys(bindings).forEach(alias => {
                const input = bindings[alias];
                // Throw an error for unknown inputs.
                if (!(input in exports.inputKeyCodeRelationships))
                    throw `Unknown input: ${input}`;
                // Initial input status is null.
                this.status[alias] = null;
            });
            // Add event listeners.
            this.start();
        }
        /**
         * Start watching keyboard activity, by adding event listeners.
         */
        start() {
            addEventListener('keydown', this.keydown);
            addEventListener('keyup', this.keyup);
        }
        /**
         * Stop watching keyboard activity, by removing event listeners.
         */
        stop() {
            removeEventListener('keydown', this.keydown);
            removeEventListener('keyup', this.keyup);
        }
        /**
         * Assign a listener to an input change.
         */
        on(alias, listener) {
            const input = this.bindings[alias];
            if (!input)
                throw new Error(`Couldn't find binding for given alias '${alias}'`);
            this.listenerBindings.push({ alias, listener });
        }
        /**
         * Remove a single listener, or clear all of an input's listener.
         * Provide a listener to remove that one specifically.
         * Omit the listener to clear all listeners from that input.
         */
        off(alias, listener) {
            // Filter out unwanted bindings.
            this.listenerBindings = this.listenerBindings.filter(listenerBinding => listenerBinding.alias !== alias || (!!listener ? listenerBinding.listener !== listener : false));
        }
        /**
         * Trigger a listener.
         */
        trigger(alias, status) {
            const input = this.bindings[alias];
            if (!input)
                throw new Error(`Couldn't find binding for given alias '${alias}'`);
            this.listenerBindings
                .filter(binding => binding.alias === alias)
                .forEach(binding => binding.listener({ input, status }));
        }
        /**
         * Given a key code, return the input (or null if no match).
         */
        getInputByKeyCode(keyCode) {
            const relation = exports.inputKeyCodeRelationships.find(relationship => relationship.code === keyCode);
            return relation ? relation.input : null;
        }
        /**
         * Given an input, return the alias.
         */
        getAliasForInput(input) {
            return Object.keys(this.bindings).find(alias => this.bindings[alias] === input);
        }
        /**
         * Destruct this watcher.
         */
        destructor() {
            this.stop();
        }
    }
    exports.default = Watcher;
    /**
     * Watcher inputs.
     * These are all of the inputs that the watcher is capable to report about.
     */
    var Input;
    (function (Input) {
        // Coming soon:
        //   Q, W, E, R, T, Y, U, I, O, P, BracketLeft, BracketRight
        //   A, S, D, F, G, H, J, K, L, Semicolon, Quote
        //   Z, X, C, V, B, N, M, Comma, Period, Slash
        Input[Input["One"] = 0] = "One";
        Input[Input["Two"] = 1] = "Two";
        Input[Input["Three"] = 2] = "Three";
        Input[Input["Four"] = 3] = "Four";
        Input[Input["Five"] = 4] = "Five";
        Input[Input["Six"] = 5] = "Six";
        Input[Input["Seven"] = 6] = "Seven";
        Input[Input["Eight"] = 7] = "Eight";
        Input[Input["Nine"] = 8] = "Nine";
        Input[Input["Zero"] = 9] = "Zero";
        Input[Input["Shift"] = 10] = "Shift";
        Input[Input["Ctrl"] = 11] = "Ctrl";
        Input[Input["Alt"] = 12] = "Alt";
        Input[Input["Space"] = 13] = "Space";
        Input[Input["W"] = 14] = "W";
        Input[Input["A"] = 15] = "A";
        Input[Input["S"] = 16] = "S";
        Input[Input["D"] = 17] = "D";
        Input[Input["Q"] = 18] = "Q";
        Input[Input["E"] = 19] = "E";
    })(Input = exports.Input || (exports.Input = {}));
    /**
     * Array of relationships between inputs and keycodes.
     */
    exports.inputKeyCodeRelationships = [
        { input: Input.W, code: 87 },
        { input: Input.A, code: 65 },
        { input: Input.S, code: 83 },
        { input: Input.D, code: 68 },
        { input: Input.Q, code: 81 },
        { input: Input.E, code: 69 },
        { input: Input.Shift, code: 16 },
        { input: Input.Ctrl, code: 17 },
        { input: Input.Alt, code: 18 },
        { input: Input.Space, code: 32 },
        { input: Input.One, code: 49 },
        { input: Input.Two, code: 50 },
        { input: Input.Three, code: 51 },
        { input: Input.Four, code: 52 },
        { input: Input.Five, code: 53 },
        { input: Input.Six, code: 54 },
        { input: Input.Seven, code: 55 },
        { input: Input.Eight, code: 56 },
        { input: Input.Nine, code: 57 },
        { input: Input.Zero, code: 48 }
    ];
});
/*

# Watcher class — watch for button presses.

## Example usage

  - Declare bindings of your own aliases to inputs. Example:

        const watcher = new Watcher({
          bindings: {
            'jump': Input.Space,
            'crouch': Input.Ctrl
          }
        })

  - Conveniently check on the status of your aliased inputs:

        watcher.status['jump']  // true || false

  - Attach a listener which is called whenever the status changes:

        watcher.on('jump', report => {
          if (report.status) startChargingJump()
          else releaseChargedJump()
        })

## Concepts and terminology

  - Bindings — relationships between aliases and inputs.

  - Input — enum value of inputs that the watcher supports (which can be aliased via bindings).

  - Status — an aliased input has a status boolean, true when the input is activated, false when the input is deactivated.

  - Listener — listener functions associated with aliases, which are attached via on/off methods. Called whenever a status changes.

## Todo

  - You can attach/remove event listeners for any input.

*/
//# sourceMappingURL=Watcher.js.map