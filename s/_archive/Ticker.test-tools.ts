
import Ticker, {TickAction, TickerOptions} from "./Ticker"

export const createSpyTicker = (options: TickerOptions = {}) => {
  const report = {
    ticks: 0
  }

  class SpyTicker extends Ticker {
    constructor(o) {
      super(o)
      this.subscribe(tick => report.ticks++)
    }
  }

  return {
    report,
    ticker: <Ticker> new SpyTicker(options)
  }
}
