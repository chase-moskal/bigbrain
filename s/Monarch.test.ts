
import {expect} from "chai"

import Simulator from "./Simulator"
import {sleep, clone} from "./toolbox"
import {Network, LocalNetwork} from "./Network"
import Monarch, {MonarchOptions} from "./Monarch"
import {createSpyDogClass} from "./Entity.test-tools"
import {createSpyTickerClass} from "./Ticker.test-tools"
import {Entity, EntityRunInput, EntityRunOutput} from "./Entity"

describe("Monarch", function() {
  this.slow(200)

  it("ticks between start and stop", async () => {
    const {Dog, report: dogReport} = createSpyDogClass()
    const {Ticker, report: tickerReport} = createSpyTickerClass()
    const context = {host: true}
    const network = new LocalNetwork({context, state: {}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({context, network, simulator, Ticker})

    expect(tickerReport.ticks).to.equal(0)
    monarch.start()

    await sleep(21)
    monarch.stop()
    expect(tickerReport.ticks).to.be.greaterThan(1)
    const ticks = clone(tickerReport.ticks)

    await sleep(20)
    expect(tickerReport.ticks).to.equal(ticks)
    monarch.destructor()
  })

  it("runs initial entities every tick", async () => {
    const {Ticker, report: tickerReport} = createSpyTickerClass()
    const {Dog, report: dogReport} = createSpyDogClass()
    const context = {host: true}
    const network = new LocalNetwork({context, state: {A123: {type: "Dog"}}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({context, network, simulator, Ticker})

    monarch.start()

    await sleep(21)
    monarch.stop()
    monarch.destructor()

    expect(tickerReport.ticks).to.be.greaterThan(1)
    expect(tickerReport.ticks).to.equal(dogReport.run)
  })

  it("constructs, runs, and destructs dog entity", async () => {
    const {Ticker, report: tickerReport} = createSpyTickerClass()
    const {Dog, report: dogReport} = createSpyDogClass()
    const context = {host: true}
    const network = new LocalNetwork({context, state: {A123: {type: "Dog"}}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({context, network, simulator, Ticker})

    monarch.start()

    await sleep(21)
    monarch.stop()
    monarch.destructor()

    expect(dogReport.constructed).to.be.equal(1)
    expect(dogReport.run).to.be.greaterThan(1)
    expect(dogReport.destructed).to.be.equal(1)
    expect(dogReport.woofs).to.equal(0)
  })
})
