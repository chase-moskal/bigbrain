
import * as babylon from "babylonjs"

export const createCubeGhostMesh = (scene: babylon.Scene): babylon.Mesh => {
	const material = new babylon.StandardMaterial("cube-ghost-material", scene)
	material.emissiveColor = new babylon.Color3(0.5, 0.5, 0.5)
	material.wireframe = true

	const mesh = babylon.Mesh.CreateBox("cube-ghost-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}
