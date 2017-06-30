
import Ticker, {TickAction, TickerOptions} from "./Ticker"

export const createSpyTickerClass = () => {

  const report = {
    ticks: 0
  }

  class SpyTicker extends Ticker {
    constructor(options: TickerOptions) {
      super({
        ...options,
        action: tick => {
          report.ticks++
          options.action(tick)
        }
      })
    }
  }

  return {
    Ticker: <typeof Ticker> SpyTicker,
    report
  }
}