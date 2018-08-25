
import * as babylon from "babylonjs"

export const createCubeProposalMesh = (scene: babylon.Scene): babylon.Mesh => {
	const material = new babylon.StandardMaterial("cube-proposal-material", scene)
	material.emissiveColor = new babylon.Color3(0.1, 0.6, 0.9)
	material.wireframe = true

	const mesh = babylon.Mesh.CreateBox("cube-proposal-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}
