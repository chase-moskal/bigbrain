
import {Mesh, ShadowGenerator, SpotLight, PhysicsImpostor} from "babylonjs"

import {Entity} from "../../entity"
import {GameContext} from "../game"
import {loadBabylonFile} from "../../toolbox"
import {StateEntry, Message} from "../../interfaces"

export interface EnvironmentEntry extends StateEntry {
	type: "Environment"
	asset: string
}

export class Environment extends Entity<GameContext, EnvironmentEntry> {

	constructor(o) {
		super(o)
		const {scene} = this.context
		loadBabylonFile(scene, this.entry.asset)
			.then(() => {
				const plane = <Mesh>scene.getMeshByName("Plane")
				const torus = <Mesh>scene.getMeshByName("Torus")
				const icosphere = <Mesh>scene.getMeshByName("Icosphere")
				const light = <SpotLight>scene.getLightByName("Spot")

				plane.physicsImpostor = new PhysicsImpostor(plane, PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.1}, scene)

				const shadowGenerator = new ShadowGenerator(1024, light)
				const shadowCasters = [torus, icosphere]
				const shadowReceivers = [plane, torus, icosphere]
				shadowGenerator.getShadowMap().renderList.push(...shadowCasters)
				plane.receiveShadows = true
				shadowGenerator.usePoissonSampling = true
			})
	}

	destructor() {}
}
