
import * as babylon from "@babylonjs/core"

export const createCubeMesh = (scene: babylon.Scene): babylon.Mesh => {
	const material = new babylon.StandardMaterial("cube-material", scene)
	material.emissiveColor = new babylon.Color3(0.1, 0.6, 0.9)

	const mesh = babylon.Mesh.CreateBox("cube-mesh", 1, scene)
	mesh.material = material
	return mesh
}
