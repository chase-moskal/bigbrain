
import * as SimplexNoise from "simplex-noise"

import babylon from "../../babylon"
import {Entity} from "../../core/entity"
import {Context} from "../game-interfaces"
import {StateEntry, TickInfo} from "../../core/interfaces"
import {loadBabylonAssets} from "../../core/toolbox/load-babylon-assets"

export interface TerrainEntry extends StateEntry {
	type: "Terrain"
}

export class Terrain extends Entity<Context, TerrainEntry> {

	async initialize() {
		return this.load(this.context.scene)
	}

	logic(tick: TickInfo) {}

	async deconstruct() {}

	private async load(scene: babylon.Scene) {
		await this.generateLighting(scene)
		await this.generateTerrain(scene)
		// await this.loadTerrainObjectFile(scene)
	}

	private async generateLighting(scene: babylon.Scene) {
		const light1 = new babylon.HemisphericLight("light1", new babylon.Vector3(5, 5, 0), scene)
		const light2 = new babylon.PointLight("light2", new babylon.Vector3(0, 5, -5), scene)
		light1.intensity = 0.4
		light2.intensity = 0.4
	}


	private async generateTerrain(scene: babylon.Scene) {
		const simplexNoise = new SimplexNoise()

		function updateVertices(mesh, vertexHandler) {
			mesh.updateMeshPositions(vertexData => {
				for (let index = 0; index < vertexData.length; index += 3) {
					const vertex = [
						vertexData[index],
						vertexData[index + 1],
						vertexData[index + 2]
					]
					const [x, y, z] = vertexHandler(vertex)
					vertexData[index] = x
					vertexData[index + 1] = y
					vertexData[index + 2] = z
				}
			})
		}

		function applyNoise({mesh, scale, magnitude}) {
			updateVertices(mesh, ([x, y, z]) => ([
				x,
				y + (simplexNoise.noise2D(x / scale, z / scale) * magnitude) - (magnitude / 2),
				z
			]))
		}

		function createTerrain({
			size,
			subdivisions,
			scene,
			meshName = "terrain-" + Math.floor(Math.random() * 1000),
		}) {
			const terrainMeshPhysical = babylon.Mesh.CreateGround(
				meshName, size, size, subdivisions, scene, true)

			terrainMeshPhysical.isVisible = false
			applyNoise({mesh: terrainMeshPhysical, scale: 20, magnitude: 2})
			applyNoise({mesh: terrainMeshPhysical, scale: 5, magnitude: 0.2})
			applyNoise({mesh: terrainMeshPhysical, scale: 0.5, magnitude: 0.02})

			const terrainMeshVisual = terrainMeshPhysical.clone()
			terrainMeshVisual.subdivide(4)
			terrainMeshVisual.isVisible = true

			applyNoise({mesh: terrainMeshVisual, scale: 10, magnitude: 0.1})
			applyNoise({mesh: terrainMeshVisual, scale: 0.25, magnitude: 0.02})

			terrainMeshVisual.physicsImpostor = new babylon.PhysicsImpostor(
				terrainMeshPhysical,
				babylon.PhysicsImpostor.MeshImpostor,
				{
					mass: 0,
					restitution: 0.1,
					friction: 0.5
				}
			)

			return {terrainMeshPhysical, terrainMeshVisual}
		}

		createTerrain({
			size: 100,
			subdivisions: 50,
			scene
		})
	}

	private async loadTerrainObjectFile(scene: babylon.Scene) {
		const container = await loadBabylonAssets({
			path: "assets/testterrains.obj",
			scene,
			onProgress: () => {}
		})

		const lowPolyMesh = container.meshes.find(mesh => mesh.name.includes("7.5k"))
		const highPolyMesh = container.meshes.find(mesh => mesh.name.includes("131k"))

		for (const mesh of container.meshes) {
			mesh.isVisible = false
		}

		for (const mesh of [lowPolyMesh, highPolyMesh])
			mesh.scaling = new babylon.Vector3(10, 10, 10)

		highPolyMesh.physicsImpostor = new babylon.PhysicsImpostor(
			lowPolyMesh,
			babylon.PhysicsImpostor.MeshImpostor,
			{
				mass: 0,
				restitution: 0.1,
				friction: 0.5
			}
		)

		highPolyMesh.isVisible = true

		container.addAllToScene()
	}
}
