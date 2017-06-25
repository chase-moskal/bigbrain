
import {expect} from "chai"

import Example from "./Example"

describe("Example", () => {

  it("sums 2 and 3 to return 5", () => {
    const example = new Example()
    const result = example.sum(2, 3)
    expect(result).to.equal(5)
  })
})
