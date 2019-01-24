
import {observable, action} from "mobx"

import {Ticker} from "../../ticker"
import {Viewport} from "../../viewport"

export class StatisticsStore {
	@observable tickRate: number = 0
	@observable timeline: number = 0
	@observable renderRate: number = 0

	@action recordTickerStats(ticker: Ticker) {
		this.tickRate = ticker.tickRate
		this.timeline = ticker.timeline
	}

	@action recordViewportStats(viewport: Viewport) {
		this.renderRate = viewport.renderRate
	}
}
