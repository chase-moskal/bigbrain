
import {expect} from "chai"

import {Message} from "./Monarch"
import Simulator from "./Simulator"
import {Entity, EntityRunInput, EntityRunOutput} from "./Entity"

interface DogMessage extends Message {
  payload: string
}

const createDogSpyReport = () => {
  const report = {
    constructed: 0,
    run: 0,
    destructed: 0,
    woofs: 0
  }

  class DogEntity extends Entity {
    constructor(o) {
      report.constructed += 1
      super(o)
    }
    run({tick, entry, messages}: EntityRunInput): EntityRunOutput {
      report.run += 1
      report.woofs += (<DogMessage[]>messages).filter(message => message.payload === "woof").length
      return {entry, messages: []}
    }
    destructor() { report.destructed++ }
  }

  return {DogEntity, report}
}

describe("Simulator", () => {

  describe("simulate", () => {
    const tick = {timeline: 0, timeSinceLastTick: 0}
    const context = {host: true}
    const state = {A123: {type: "Dog"}}
    const messages = []

    it("constructs new entities", () => {
      const {DogEntity, report} = createDogSpyReport()
      const simulator = new Simulator({context, entityClasses: {Dog: DogEntity}})
      expect(report.constructed).to.equal(0)
      const output = simulator.simulate({tick, state, messages})
      expect(report.constructed).to.equal(1)
      expect(output.state.A123.type).to.equal("Dog")
    })

    it("runs entities", () => {
      const {DogEntity, report} = createDogSpyReport()
      const simulator = new Simulator({context, entityClasses: {Dog: DogEntity}})
      const output = simulator.simulate({tick, state, messages})
      expect(report.run).to.equal(1)
    })

    it("forwards messages to entities", () => {
      const {DogEntity, report} = createDogSpyReport()
      const simulator = new Simulator({context, entityClasses: {Dog: DogEntity}})
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
      const {DogEntity, report} = createDogSpyReport()
      const simulator = new Simulator({context, entityClasses: {Dog: DogEntity}})
      const output = simulator.simulate({tick, state, messages})
      expect(report.constructed).to.equal(1)
      const output2 = simulator.simulate({tick, state: {}, messages})
      expect(report.constructed).to.equal(1)
      expect(report.destructed).to.equal(1)
    })
  })
})
