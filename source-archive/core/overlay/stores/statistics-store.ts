
import {observable, action} from "mobx"

export class StatisticsStore {
	@observable timeline: number = 0
	@observable slowTickRate: number = 0
	@observable logicTickRate: number = 0
	@observable hyperTickRate: number = 0
	@observable renderFrameRate: number = 0

	@action recordTickerStats({timeline, slowTickRate, logicTickRate, hyperTickRate, renderFrameRate}: {
		timeline: number
		slowTickRate: number
		logicTickRate: number
		hyperTickRate: number
		renderFrameRate: number
	}) {
		this.timeline = timeline
		this.slowTickRate = slowTickRate
		this.logicTickRate = logicTickRate
		this.hyperTickRate = hyperTickRate
		this.renderFrameRate = renderFrameRate
	}

	@action recordViewportStats({renderFrameRate}: {renderFrameRate: number}) {
		this.renderFrameRate = renderFrameRate
	}
}
