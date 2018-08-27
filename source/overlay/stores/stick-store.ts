
import {observable, action} from "mobx"
import {ThumbstickInfo} from "../../game/tools/tools-interfaces"

export class StickStore implements ThumbstickInfo {
	@observable angle: number
	@observable force: number
	@observable active: boolean = true

	@action setInfo({angle, force}: ThumbstickInfo) {
		this.angle = angle
		this.force = force
	}

	@action setActive(active: boolean) {
		this.active = active
	}
}
