
import {expect} from "chai"

import {Message} from "./Network"
import Simulator from "./Simulator"
import {Entity, LogicInput, LogicOutput} from "./Entity"
import {createSpyDogClass, DogMessage} from "./Entity.test-tools"

describe("Simulator", () => {
  const tick = {timeline: 0, timeSinceLastTick: 0}
  const context = {host: true}
  const state = {A123: {type: "Dog"}}
  const messages = []

  it("constructs new entities", () => {
    const {Dog, report} = createSpyDogClass()
    const simulator = new Simulator({context, entityClasses: {Dog}})
    expect(report.constructed).to.equal(0)
    const output = simulator.simulate({tick, state, messages})
    expect(report.constructed).to.equal(1)
    expect(output.state.A123.type).to.equal("Dog")
  })

  it("runs entity logic", () => {
    const {Dog, report} = createSpyDogClass()
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const output = simulator.simulate({tick, state, messages})
    expect(report.logic).to.equal(1)
  })

  it("forwards messages to entities", () => {
    const {Dog, report} = createSpyDogClass()
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const output = simulator.simulate({
      tick,
      state,
      messages: [
        <DogMessage>{recipient: "A123", payload: "woof"},
        <DogMessage>{recipient: "B234", payload: "woof"} // there is no B234 dog, so this message should not be received
      ]
    })
    expect(report.woofs).to.equal(1)
  })

  it("destructs old entities", () => {
    const {Dog, report} = createSpyDogClass()
    const simulator = new Simulator({context, entityClasses: {Dog}})
    const output = simulator.simulate({tick, state, messages})
    expect(report.constructed).to.equal(1)
    const output2 = simulator.simulate({tick, state: {}, messages})
    expect(report.constructed).to.equal(1)
    expect(report.destructed).to.equal(1)
  })
})
