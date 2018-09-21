
import {StateEntry} from "../../../interfaces"
import {MechanicMenuStore} from "./mechanic-menu-store"

export interface MechanicEntry extends StateEntry {
	type: "Mechanic"
}

export interface MechanicMenuProps {
	store: MechanicMenuStore
}

export interface WorldObject {
	label: string
	babylonObject: any
}
