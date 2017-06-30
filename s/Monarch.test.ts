
import {expect} from "chai"

import Network from "./Network"
import {sleep, clone} from "./toolbox"
import Simulator from "./Simulator"
import Monarch, {MonarchOptions} from "./Monarch"
import {createSpyDogClass} from "./Entity.test-tools"
import {createSpyTickerClass} from "./Ticker.test-tools"
import {Entity, EntityRunInput, EntityRunOutput} from "./Entity"

describe("Monarch", function() {
  this.slow(200)

  it("runs initial entities every tick", async () => {
    const {Ticker, report: tickerReport} = createSpyTickerClass()
    const {Dog, report: dogReport} = createSpyDogClass()

    const context = {host: true}
    const network = new Network({context})
    const simulator = new Simulator({context, entityClasses: {Dog}})

    const monarch = new Monarch({
      context, network, simulator, Ticker,
      state: {A123: {type: "Dog"}}
    })

    monarch.start()
    await sleep(35)

    monarch.stop()
    monarch.destructor()

    expect(tickerReport.ticks).to.be.greaterThan(2)
    expect(tickerReport.ticks).to.equal(dogReport.run)
  })

  it("ticks between start and stop", async () => {
    const {Dog, report: dogReport} = createSpyDogClass()
    const {Ticker, report: tickerReport} = createSpyTickerClass()

    const context = {host: true}
    const network = new Network({context})
    const simulator = new Simulator({context, entityClasses: {Dog}})

    const monarch = new Monarch({
      context, network, simulator, Ticker,
      state: {A123: {type: "Dog"}}
    })

    expect(tickerReport.ticks).to.equal(0)

    monarch.start()
    await sleep(35)

    monarch.stop()
    expect(tickerReport.ticks).to.be.greaterThan(2)
    const ticks = clone(tickerReport.ticks)
    await sleep(20)
  
    expect(tickerReport.ticks).to.equal(ticks)
    monarch.destructor()
  })

  it("constructs, runs, and destructs dog entity", async () => {
    const {Ticker, report: tickerReport} = createSpyTickerClass()
    const {Dog, report: dogReport} = createSpyDogClass()

    const context = {host: true}
    const network = new Network({context})
    const simulator = new Simulator({context, entityClasses: {Dog}})

    const monarch = new Monarch({
      context, network, simulator, Ticker,
      state: {A123: {type: "Dog"}}
    })

    monarch.start()
    await sleep(35)

    monarch.stop()
    monarch.destructor()

    expect(dogReport.constructed).to.be.equal(1)
    expect(dogReport.run).to.be.greaterThan(2)
    expect(dogReport.destructed).to.be.equal(1)
    expect(dogReport.woofs).to.equal(0)
  })
})
