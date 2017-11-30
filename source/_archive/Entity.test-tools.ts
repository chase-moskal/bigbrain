
import {Message} from "./Network"
import {Entity, LogicInput, LogicOutput, GenericEntity} from "./Entity"

export interface DogMessage extends Message {
  payload: string
}

export const createSpyDogClass = () => {
  const report = {
    constructed: 0,
    logic: 0,
    destructed: 0,
    woofs: 0
  }

  class Dog extends Entity {

    constructor(o) {
      super(o)
      report.constructed += 1
    }

    logic({tick, entry, messages}: LogicInput): LogicOutput {
      report.logic += 1
      report.woofs += (<DogMessage[]>messages).filter(message => message.payload === "woof").length
      return {entry, messages: []}
    }

    destructor() { report.destructed++ }
  }

  return {Dog: <typeof GenericEntity>Dog, report}
}
