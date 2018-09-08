
import {Game} from "../game/game"
import {Service} from "../toolbox"

import {PropEditorOptions} from "./propshop-interfaces"

/**
 * Prop editor is an extension of game
 * - special mode allows us to load babylon files
 * - we can rotate and view props
 * - we can place collision spheres inside
 * - we can preview the object physically
 *   watch it flop down, poke at it with impulses
 * - functionality to save a prop json file
 */
export class PropEditor extends Game implements Service {
	private readonly menu

	constructor(options: PropEditorOptions) {
		super(options)
		this.addPropEditorMenu()
	}

	/**
	 * Clean up
	 */
	destructor() {
		super.destructor()
		this.removePropEditorMenu()
	}

	/**
	 * Register the menu with the overlay
	 */
	private addPropEditorMenu() {}

	/**
	 * Unregister the menu with the overlay
	 */
	private removePropEditorMenu() {}
}
