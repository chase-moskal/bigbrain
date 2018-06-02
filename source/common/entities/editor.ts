
import {reaction} from "mobx"
import * as nipplejs from "nipplejs"
import {FreeCamera, Mesh, Vector3} from "babylonjs"

import {Context} from "../../game"
import {Ticker} from "../../ticker"
import {Entity} from "../../entity"
import {Watcher, Input} from "../../watcher"
import {Vector, Physique, Bearings, Quaternion} from "../../interfaces"
import {CubeEntry, createCubeMesh, createCubeProposalMesh} from "./cube"
import {makeCamera, applyLogicalMovement, traversiveBindings} from "../tools/camtools"

export function establishVirtualThumbstick({zone}: {
	zone: HTMLElement
}) {
	const manager = nipplejs.create({
		zone,
		size: 200,
		color: "white",
		mode: "static",
		position: {bottom: "50%", left: "50%"}
	})
	return {manager}
}

export interface EditorEntry {
	type: "Editor"
	bearings: Bearings
}

export const bindings = {
	...traversiveBindings,
	propose: [Input.E],
	place: [Input.MouseLeft],
	remove: [Input.X, Input.Backspace, Input.Delete]
}

export class Editor extends Entity<Context, EditorEntry> {
	protected readonly context: Context
	private readonly propSpawnHeight: number = 0.2

	readonly camera: FreeCamera = makeCamera({
		scene: this.context.scene,
		bearings: this.entry.bearings,
		speed: 0.4
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

	private proposedSize: number = 1
	private getRandomSize() {
		return 0.1 + (Math.random() * 1.5)
	}

	private proposalMesh: Mesh = null
	private readonly propsalTicker = new Ticker({
		action: tick => {
			const {aimpoint, proposalMesh} = this
			if (aimpoint) aimpoint.y += this.proposedSize + this.propSpawnHeight
			this.proposalMesh.position = aimpoint || Vector3.Zero()
		}
	})

	private thumbsticks = (() => {
		const {overlay} = this.context
		const zones = {
			left: overlay.querySelector<HTMLDivElement>(".leftstick"),
			right: overlay.querySelector<HTMLDivElement>(".rightstick")
		}
		const leftStick = establishVirtualThumbstick({zone: zones.left})
		const rightStick = establishVirtualThumbstick({zone: zones.right})
		rightStick.manager.on("move", (event, nipple) => {})
		leftStick.manager.on("move", (event, nipple) => {
			console.log("left stick move", event, nipple)
		})
		const thumbsticks = {leftStick, rightStick}
		window["thumbsticks"] = thumbsticks
		return thumbsticks
	})()

	private reactions = [

		// react to propose button (editor proposing prop placement)
		reaction(() => this.watcher.status.propose, propose => {
			if (propose) {
				if (!this.proposalMesh) {
					const {scene} = this.context
					const {aimpoint} = this
					const position = <Vector>(aimpoint ? aimpoint.asArray() : [0, 0, 0])
					const s = this.proposedSize = this.getRandomSize()
					const physique: Physique = {
						mass: s,
						size: [s, s, s]
					}
					const bearings: Bearings = {
						position,
						rotation: [0, 0, 0, 0]
					}
					const mesh = createCubeProposalMesh(scene)
					mesh.scaling = Vector3.FromArray(physique.size)
					mesh.position = Vector3.FromArray(bearings.position)
					mesh.position.y += this.proposedSize + this.propSpawnHeight
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
				const s = this.proposedSize
				manager.addEntry(<CubeEntry>{
					type: "Cube",
					physique: {
						mass: s,
						size: [s, s, s]
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
					const mesh = pick.pickedMesh
					if (mesh["entryId"]) manager.removeEntry(mesh["entryId"])
				}
			}
		})
	]

	async destructor() {
		this.watcher.destructor()
		this.ticker.destructor()
		for (const dispose of this.reactions) dispose()
	}
}
