
import * as babylon from "@babylonjs/core"

export function createLaserDot({scene}: {scene: babylon.Scene}) {

	const material = new babylon.StandardMaterial("laser-dot-mat", scene)
	const red = new babylon.Color3(255, 0, 0)

	material.alpha = 0.5
	material.emissiveColor
		= material.diffuseColor
		= material.ambientColor
		= material.specularColor
		= red

	const mesh = babylon.Mesh.CreateIcoSphere("laser-dot", {
		radius: 0.1,
		flat: false,
		subdivisions: 2
	}, scene)

	mesh.material = material
	mesh.isPickable = false

	return mesh
}
