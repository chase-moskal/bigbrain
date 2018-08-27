
import {observable, action} from "mobx"
import {StickStore} from "./stick-store"

export class OverlayStore {
	@observable stick1: StickStore = new StickStore()
	@observable stick2: StickStore = new StickStore()
}
