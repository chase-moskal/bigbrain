
import {Message} from "./Network"
import {Entity, EntityRunInput, EntityRunOutput} from "./Entity"

export interface DogMessage extends Message {
  payload: string
}

export const createSpyDogClass = () => {
  const report = {
    constructed: 0,
    run: 0,
    destructed: 0,
    woofs: 0
  }

  class Dog extends Entity {

    constructor(o) {
      super(o)
      report.constructed += 1
    }

    run({tick, entry, messages}: EntityRunInput): EntityRunOutput {
      report.run += 1
      report.woofs += (<DogMessage[]>messages).filter(message => message.payload === "woof").length
      return {entry, messages: []}
    }

    destructor() { report.destructed++ }
  }

  return {Dog: (<typeof Entity>Dog), report}
}
