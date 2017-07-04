
import {Engine, Scene} from "babylonjs"

import Susa from "../Susa"
import Ticker from "../Ticker"
import Simulator from "../Simulator"
import Monarch, {Context} from "../Monarch"
import {PlaygroundContext} from "./PlaygroundGame"
import {LoopbackNetwork, StateEntry, Message} from "../Network"
import {Entity, GenericEntity, EntityClasses, LogicInput, LogicOutput} from "../Entity"

export interface CubeEntry extends StateEntry {
  lifespan: number
}

export interface CubeMessage extends Message {}

export default class Cube extends Entity<PlaygroundContext> {

  logic({tick, entry, messages}: LogicInput<CubeEntry, CubeMessage>): LogicOutput<CubeEntry, CubeMessage> {
    if (this.context.host) {}
    return {
      entry: {type: "Cube", lifespan: 0},
      messages: [{recipient: ""}]
    }
  }

  destructor() {}
}
