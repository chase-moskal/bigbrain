
import * as babylon from "@babylonjs/core"

export const createCubeProposalMesh = (scene: babylon.Scene): babylon.Mesh => {
	const material = new babylon.StandardMaterial("cube-proposal-material", scene)
	const color = new babylon.Color3(0.4, 0.8, 1)

	material.alpha = 0.75
	material.wireframe = true
	material.emissiveColor
		= material.diffuseColor
		= material.ambientColor
		= material.specularColor
		= color

	const mesh = babylon.Mesh.CreateBox("cube-proposal-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}
