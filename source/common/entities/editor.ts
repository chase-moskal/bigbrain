
import {reaction} from "mobx"
import * as babylon from "babylonjs"

import {cap} from "../../toolbox"
import {Context} from "../../game"
import {Entity} from "../../entity"
import {Ticker} from "../../ticker"
import {Watcher, Input} from "../../watcher"
import {Thumbstick} from "../tools/thumbstick"
import {makeBasicCamera} from "../tools/camtools"
import {CubeEntry, createCubeProposalMesh} from "./cube"
import {Vector, Physique, Bearings, Quaternion} from "../../interfaces"
import {traversiveBindings, ascertainMovement, enactMovement} from "../tools/traversal"

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

	readonly camera = makeBasicCamera({
		scene: this.context.scene,
		bearings: this.entry.bearings
	})

	private readonly watcher = new Watcher<typeof bindings>({eventTarget: this.context.window, bindings})

	private readonly thumbsticks = {
		moveStick: new Thumbstick({
			zone: this.context.overlay.querySelector(".leftstick")
		}),
		lookStick: new Thumbstick({
			zone: this.context.overlay.querySelector(".rightstick")
		})
	}

	private readonly ticker: Ticker = (() => {
		const ticker = new Ticker({action: tick => {
			const {camera, watcher, thumbsticks} = this
			if (thumbsticks) {
				const move = ascertainMovement({watcher, stickInfo: thumbsticks.moveStick.info})
				enactMovement({node: <any>camera, move})
				this.ascertainThumbLook()
				this.enactLook()
			}
		}})
		ticker.start()
		return ticker
	})()

	private ascertainThumbLook() {
		const {thumbsticks} = this
		if (!thumbsticks) return
		const {lookStick} = thumbsticks
		const {angle, force} = lookStick.info
		if (force > 0) {
			const {freelook} = this
			const x = Math.cos(angle)
			const y = -Math.sin(angle)
			const factor = force / 25
			freelook.add(x * factor, y * factor)
		}
	}

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

	private proposalMesh: babylon.Mesh = null
	private readonly propsalTicker = new Ticker({
		action: tick => {
			const {aimpoint, proposalMesh} = this
			if (aimpoint) aimpoint.y += this.proposedSize + this.propSpawnHeight
			this.proposalMesh.position = aimpoint || babylon.Vector3.Zero()
		}
	})

	private freelook = {
		vertical: 0,
		horizontal: 0,
		add(horizontal: number, vertical: number) {
			this.horizontal += horizontal
			this.vertical += vertical
			this.vertical = cap(this.vertical, -(Math.PI / 2), Math.PI / 2)
		}
	}

	private enactLook() {
		const {freelook, camera} = this
		if (!freelook) return
		const {vertical, horizontal} = freelook
		const quaternion = babylon.Quaternion.RotationYawPitchRoll(horizontal, vertical, 0)
		camera.rotationQuaternion = quaternion
	}

	private eventHandlers = {
		mousemove: (event: MouseEvent) => {
			const {movementX, movementY} = event
			if (movementX && movementY) {
				const sensitivity = 2000
				const {camera, freelook} = this
				freelook.add(movementX / sensitivity, movementY / sensitivity)
			}
		}
	}

	async init() {
		for (const eventName of Object.keys(this.eventHandlers)) {
			window.addEventListener(eventName, this.eventHandlers[eventName], false)
		}
	}

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
		for (const eventName of Object.keys(this.eventHandlers)) {
			window.removeEventListener(eventName, this.eventHandlers[eventName])
		}
	}
}
