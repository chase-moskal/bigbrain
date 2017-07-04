
import {Engine, Scene} from "babylonjs"

import Susa from "../Susa"
import Ticker from "../Ticker"
import Simulator from "../Simulator"
import Monarch, {Context} from "../Monarch"
import {PlaygroundContext} from "./PlaygroundGame"
import {LoopbackNetwork, StateEntry} from "../Network"
import {Entity, GenericEntity, EntityClasses, LogicInput, LogicOutput} from "../Entity"

export interface CubeEntry extends StateEntry {
  lifespan: number
}

export interface CubeLogicInput extends LogicInput {
  entry: CubeEntry
}

export interface CubeLogicOutput extends LogicOutput {
  entry: CubeEntry
}

export default class Cube extends Entity<PlaygroundContext> {

  logic({tick, entry, messages}: CubeLogicInput): CubeLogicOutput {
    if (this.context.host) {}
    return {
      entry: {type: "Cube", lifespan: 0},
      messages: [{recipient: ""}]
    }
  }

  destructor() {}
}
