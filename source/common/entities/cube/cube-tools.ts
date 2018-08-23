
import {
	Mesh,
	Scene,
	Color3,
	StandardMaterial
} from "babylonjs"

export const createCubeMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("cube-material", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)

	const mesh = Mesh.CreateBox("cube-mesh", 1, scene)
	mesh.material = material
	return mesh
}

export const createCubeProposalMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("cube-proposal-material", scene)
	material.emissiveColor = new Color3(0.1, 0.6, 0.9)
	material.wireframe = true

	const mesh = Mesh.CreateBox("cube-proposal-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}

export const createCubeGhostMesh = (scene: Scene): Mesh => {
	const material = new StandardMaterial("cube-ghost-material", scene)
	material.emissiveColor = new Color3(0.5, 0.5, 0.5)
	material.wireframe = true

	const mesh = Mesh.CreateBox("cube-ghost-mesh", 1, scene)
	mesh.material = material
	mesh.isPickable = false
	return mesh
}
