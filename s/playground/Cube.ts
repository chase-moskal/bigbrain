
import {Mesh} from "babylonjs"

import {StateEntry, Message} from "../Network"
import {Entity, LogicInput, LogicOutput} from "../Entity"

import {PlaygroundEntity} from "./Playground"

export interface CubeEntry extends StateEntry {
  lifespan: number
}

export interface CubeMessage extends Message {}

export default class Cube extends PlaygroundEntity {
  private readonly box = Mesh.CreateBox("Box", 2, this.context.scene)

  logic({tick, entry, messages}: LogicInput<CubeEntry, CubeMessage>): LogicOutput<CubeEntry, CubeMessage> {
    return {entry, messages: []}
  }
}
