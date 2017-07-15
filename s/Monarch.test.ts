
import {expect} from "chai"

import Simulator from "./Simulator"
import {sleep, clone} from "./toolbox"
import Monarch, {MonarchOptions} from "./Monarch"
import {Network, LoopbackNetwork} from "./Network"
import {createSpyTicker} from "./Ticker.test-tools"
import {createSpyDogClass} from "./Entity.test-tools"
import {Entity, LogicInput, LogicOutput} from "./Entity"

describe("Monarch", function() {
  this.slow(200)

  it("ticks between start and stop", async () => {
    const {Dog, report: dogReport} = createSpyDogClass()
    const {ticker, report: tickerReport} = createSpyTicker()
    const context = {host: true}
    const network = new LoopbackNetwork({context, state: {}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({ticker, network, simulator, services: []})

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

  it("run initial entity logic every tick", async () => {
    const {ticker, report: tickerReport} = createSpyTicker()
    const {Dog, report: dogReport} = createSpyDogClass()
    const context = {host: true}
    const network = new LoopbackNetwork({context, state: {A123: {type: "Dog"}}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({ticker, network, simulator, services: []})

    monarch.start()

    await sleep(21)
    monarch.stop()
    monarch.destructor()

    expect(tickerReport.ticks).to.be.greaterThan(1)
    expect(tickerReport.ticks).to.equal(dogReport.logic)
  })

  it("orchestrates entity lifecycle (construct, logic, destruct)", async () => {
    const {ticker, report: tickerReport} = createSpyTicker()
    const {Dog, report: dogReport} = createSpyDogClass()
    const context = {host: true}
    const network = new LoopbackNetwork({context, state: {A123: {type: "Dog"}}})
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const monarch = new Monarch({ticker, network, simulator, services: []})

    monarch.start()

    await sleep(21)
    monarch.stop()
    monarch.destructor()

    expect(dogReport.constructed).to.be.equal(1)
    expect(dogReport.logic).to.be.greaterThan(1)
    expect(dogReport.destructed).to.be.equal(1)
    expect(dogReport.woofs).to.equal(0)
  })
})
