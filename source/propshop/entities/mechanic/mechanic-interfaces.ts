
import * as babylon from "babylonjs"
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
	babylonMesh: babylon.AbstractMesh
}

export interface ErrorReport {
	id?: string
	label: string
	message: string
}
