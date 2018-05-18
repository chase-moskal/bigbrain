
import {reaction} from "mobx"
import {FreeCamera, Mesh, Vector3} from "babylonjs"

import Ticker from "../../ticker"
import {GameContext} from "../game"
import {Entity} from "../../monarch"
import Watcher, {Input} from "../../watcher"
import {Vector, Physique, Bearings, Quaternion} from "../../data"

import {CubeEntry, createCubeMesh, createCubeProposalMesh, IdentifiableMesh} from "./cube"
import {makeCamera, applyLogicalMovement, bindings as spectatorBindings} from "./spectator"

export interface EditorEntry {
	type: "Editor"
	bearings: Bearings
}

export const bindings = {
	...spectatorBindings,
	propose: [Input.E],
	place: [Input.MouseLeft],
	remove: [Input.X, Input.Backspace, Input.Delete]
}

const proposalHeight = 0.6

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

	private proposalMesh: Mesh = null
	private readonly propsalTicker = new Ticker({
		action: tick => {
			const {aimpoint, proposalMesh} = this
			if (aimpoint) aimpoint.y += proposalHeight
			this.proposalMesh.position = aimpoint || Vector3.Zero()
		}
	})

	private reactions = [

		// react to propose button (editor proposing prop placement)
		reaction(() => this.watcher.status.propose, propose => {
			if (propose) {
				if (!this.proposalMesh) {
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
					const mesh = createCubeProposalMesh(scene)
					mesh.scaling = Vector3.FromArray(physique.size)
					mesh.position = Vector3.FromArray(bearings.position)
					mesh.position.y += proposalHeight
					this.proposalMesh = mesh
					this.propsalTicker.start()
				}
			}
			else {
				this.propsalTicker.stop()
				if (this.proposalMesh) {
					this.proposalMesh.dispose()
					this.proposalMesh = null
				}
			}
		}),

		// react to placement button
		reaction(() => this.watcher.status.place, place => {
			const {scene, canvas, manager} = this.context
			const {proposalMesh} = this
			if (place && proposalMesh) {
				manager.addEntry(<CubeEntry>{
					type: "Cube",
					physique: {
						mass: 1,
						size: [1, 1, 1]
					},
					bearings: {
						position: <Vector>proposalMesh.position.asArray(),
						rotation: <Quaternion>proposalMesh.rotation.asArray()
					}
				})
			}
		}),

		// react to removal button
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
