
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import {Entity} from "../../monarch"
import {Context} from "../game"

export interface AgentEntry {
  type: "Agent",
  position: [number, number, number]
}

export default class Agent extends Entity<Context, AgentEntry> {
  destructor() {}
}
