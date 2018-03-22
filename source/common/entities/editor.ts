
import {reaction} from "mobx"
import {FreeCamera, Mesh, Vector3} from "babylonjs"

import Ticker from "../../ticker"
import {GameContext} from "../game"
import {Entity} from "../../monarch"
import {Vector, Physique, Bearings, Quaternion} from "../../physics/data"
import Watcher, {Input} from "../../watcher"

import {CubeEntry, createCubeMesh, IdentifiableMesh} from "./cube"
import {makeCamera, applyLogicalMovement, bindings as spectatorBindings} from "./spectator"

export interface EditorEntry {
	type: "Editor"
	bearings: Bearings
}

export const bindings = {
	...spectatorBindings,
	ghost: [Input.E],
	place: [Input.MouseLeft],
	remove: [Input.X, Input.Backspace, Input.Delete]
}

export default class Editor extends Entity<GameContext, EditorEntry> {
	protected readonly context: GameContext

	readonly camera: FreeCamera = makeCamera({
		scene: this.context.scene,
		bearings: this.entry.bearings,
		speed: 0.1
	})

	private readonly watcher = new Watcher<typeof bindings>({eventTarget: this.context.window, bindings})

	private readonly ticker: Ticker = (() => {
		const {camera, watcher} = this
		const ticker = new Ticker({action: tick => applyLogicalMovement({tick, camera, watcher})})
		ticker.start()
		return ticker
	})()

	get aimpoint() {
		const {scene, canvas} = this.context
		const {pickedPoint: aimpoint} = scene.pick(canvas.width / 2, canvas.height / 2)
		return aimpoint
	}

	private middlePick() {
		const {scene, canvas} = this.context
		return scene.pick(canvas.width / 2, canvas.height / 2)
	}

	private ghostMesh: Mesh = null
	private readonly ghostTicker = new Ticker({
		action: tick => {
			const {aimpoint, ghostMesh} = this
			if (aimpoint) aimpoint.y += 0.5
			this.ghostMesh.position = aimpoint || Vector3.Zero()
		}
	})

	private reactions = [

		// ghost mode
		reaction(() => this.watcher.status.ghost, ghost => {
			if (ghost) {
				if (!this.ghostMesh) {
					const {scene} = this.context
					const {aimpoint} = this
					const position = <Vector>(aimpoint ? aimpoint.asArray() : [0, 0, 0])
					const physique: Physique = {
						mass: 1,
						size: [1, 1, 1]
					}
					const bearings: Bearings = {
						position,
						rotation: [0, 0, 0, 0]
					}
					const mesh = createCubeMesh({scene, physique, bearings})
					mesh.material.wireframe = true
					mesh.isPickable = false
					mesh.position.y += 0.5
					this.ghostMesh = mesh
					this.ghostTicker.start()
				}
			}
			else {
				this.ghostTicker.stop()
				if (this.ghostMesh) {
					this.ghostMesh.dispose()
					this.ghostMesh = null
				}
			}
		}),

		// placement action
		reaction(() => this.watcher.status.place, place => {
			const {scene, canvas, manager} = this.context
			const {ghostMesh} = this
			if (place && ghostMesh) {
				manager.addEntry(<CubeEntry>{
					type: "Cube",
					physique: {
						mass: 1,
						size: [1, 1, 1]
					},
					bearings: {
						position: <Vector> ghostMesh.position.asArray(),
						rotation: <Quaternion> ghostMesh.rotation.asArray()
					}
				})
			}
		}),

		// removal action
		reaction(() => this.watcher.status.remove, remove => {
			const {scene, canvas, manager} = this.context
			if (remove) {
				const pick = this.middlePick()
				if (pick && pick.pickedMesh) {
					const mesh = <IdentifiableMesh>pick.pickedMesh
					if (mesh.entryId) manager.removeEntry(mesh.entryId)
				}
			}
		})
	]

	destructor() {
		this.watcher.destructor()
		this.ticker.destructor()
		for (const dispose of this.reactions) dispose()
	}
}
