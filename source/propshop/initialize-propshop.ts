
import {Propshop} from "./propshop"
import {ModeOfConduct} from "../interfaces"

import {Mechanic} from "./entities/mechanic/mechanic"
import {MechanicEntry} from "./entities/mechanic/mechanic-interfaces"

export function initializePropshop() {

	const propshop = new Propshop({
		gravity: [0, -9.82, 0],
		mode: ModeOfConduct.Alone,
		entityClasses: {Mechanic},
		canvas: document.querySelector("canvas"),
		overlayElement: document.querySelector(".overlay"),
	})

	propshop.manager.addEntry<MechanicEntry>({type: "Mechanic"})
}
