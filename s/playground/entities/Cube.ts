
import {Scene, Mesh, Vector3, StandardMaterial, Color3} from "babylonjs"

import {Entity} from "../../Monarch"
import {PlaygroundContext} from "../Playground"

export interface CubeEntry {
  type: "Cube",
  size: number
  position: [number, number, number]
}

export const createCubeMesh = ({scene, size, position}: {
  scene: Scene
  size: number
  position: [number, number, number]
}): Mesh => {
  const material = new StandardMaterial("Cube", scene)
  material.emissiveColor = new Color3(0.1, 0.6, 0.9)

  const mesh = Mesh.CreateBox("Cube", size, scene)
  mesh.position = Vector3.FromArray(position)
  mesh.material = material

  return mesh
}

export default class Cube extends Entity<PlaygroundContext, CubeEntry> {

  private readonly mesh: Mesh = (() => {
    const {scene} = this.context
    const {size, position} = this.entry
    return createCubeMesh({scene, size, position})
  })()

  destructor() {
    this.mesh.dispose()
  }
}
