
import * as mobx from "mobx"
import * as babylon from "babylonjs"

import {Ticker} from "../../ticker"
import {Manager} from "../../manager"
import {Watcher, Input} from "../../watcher"
import {Vector, Bearings, Physique, Quaternion} from "../../interfaces"

import {CubeEntry, createCubeProposalMesh} from "../entities/cube"

export const propBindings = {
	propose: [Input.E],
	place: [Input.MouseLeft],
	remove: [Input.X, Input.Backspace, Input.Delete]
}

export interface PropSystemOptions {
	manager: Manager
	scene: babylon.Scene
	canvas: HTMLCanvasElement
}

export class PropSystem {
	private readonly watcher = new Watcher<typeof propBindings>({bindings: propBindings})
	private readonly manager: Manager
	private readonly scene: babylon.Scene
	private readonly canvas: HTMLCanvasElement
	private readonly propSpawnHeight: number = 0.2

	constructor(options: PropSystemOptions) {
		this.manager = options.manager
		this.scene = options.scene
		this.canvas = options.canvas
	}

	get aimpoint() {
		const {scene, canvas} = this
		const {pickedPoint: aimpoint} = scene.pick(canvas.width / 2, canvas.height / 2)
		return aimpoint
	}

	private middlePick() {
		const {scene, canvas} = this
		return scene.pick(canvas.width / 2, canvas.height / 2)
	}

	private proposedSize: number = 1
	private getRandomSize() {
		return 0.1 + (Math.random() * 1.5)
	}

	private proposalMesh: babylon.Mesh = null
	private readonly propsalTicker = new Ticker({
		tickAction: tick => {
			const {aimpoint, proposalMesh} = this
			if (aimpoint) aimpoint.y += this.proposedSize + this.propSpawnHeight
			proposalMesh.position = aimpoint || babylon.Vector3.Zero()
		}
	})

	private reactions = [

		// react to propose button (editor proposing prop placement)
		mobx.reaction(() => this.watcher.status.propose, propose => {
			if (propose) {
				if (!this.proposalMesh) {
					const {scene} = this
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
					mesh.scaling = babylon.Vector3.FromArray(physique.size)
					mesh.position = babylon.Vector3.FromArray(bearings.position)
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
		mobx.reaction(() => this.watcher.status.place, place => {
			const {manager, proposalMesh} = this
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
		mobx.reaction(() => this.watcher.status.remove, remove => {
			const {manager} = this
			if (remove) {
				const pick = this.middlePick()
				if (pick && pick.pickedMesh) {
					const mesh = pick.pickedMesh
					if (mesh["entryId"]) manager.removeEntry(mesh["entryId"])
				}
			}
		})
	]

	destructor() {
		this.watcher.destructor()
		for (const dispose of this.reactions) dispose()
	}
}
