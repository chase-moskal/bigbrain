
import {expect} from "chai"

import {identical} from "./toolbox"
import {Network, LocalNetwork} from "./Network"

describe("LocalNetwork", () => {

  it("feedback loop is active", () => {
    const state = {A123: {type: "Dog"}}
    const network = new LocalNetwork({context: {host: true}, state})

    const first = network.recv()
    expect(first.state).to.deep.equal(state)

    const second = network.recv()
    expect(second.state).to.deep.equal(state)

    const newState = {A123: <any>{type: "Dog", a: 1}}
    const newMessages = [<any>{recipient: "A123", b: 2}]
    network.send({state: newState, messages: newMessages})

    const third = network.recv()
    expect(third.state).to.deep.equal(newState)
    expect(third.messages).to.deep.equal(newMessages)
  })
})
