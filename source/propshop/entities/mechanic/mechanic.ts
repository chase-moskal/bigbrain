
import {Entity} from "../../../entity"
import {MechanicEntry} from "./mechanic-interfaces"
import {PropshopContext} from "../../propshop-interfaces"

export class Mechanic extends Entity<PropshopContext, MechanicEntry> {
	async destructor() {}
}
