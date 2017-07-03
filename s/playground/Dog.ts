
import {Engine, Scene} from "babylonjs"

import Susa from "../Susa"
import Ticker from "../Ticker"
import Simulator from "../Simulator"
import Monarch, {Context} from "../Monarch"
import {PlaygroundContext} from "./PlaygroundGame"
import {LoopbackNetwork, StateEntry} from "../Network"
import {Entity, GenericEntity, EntityClasses, LogicInput, LogicOutput} from "../Entity"

export interface DogEntry extends StateEntry {
  woofs: number
}
export interface DogLogicInput extends LogicInput {
  entry: DogEntry
}
export interface DogLogicOutput extends LogicOutput {
  entry: DogEntry
}

export default class Dog extends Entity<PlaygroundContext> {
  logic({tick, entry, messages}: DogLogicInput): DogLogicOutput {
    if (this.context.host) {}
    return {
      entry: {type: "Dog", woofs: 1},
      messages: [{recipient: ""}]
    }
  }

  destructor() {}
}
