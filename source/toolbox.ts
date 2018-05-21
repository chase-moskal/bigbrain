
import {SceneLoader, Scene, SceneLoaderProgressEvent} from "babylonjs"

import {GenericEntity, EntityClasses} from "./entity"

export function copy<T>(o: T): T { return JSON.parse(JSON.stringify(o)) }

export function assignPropsOntoMap(obj: Object, map: Map<string, any>) {
	Object.keys(obj).forEach(key => map.set(key, obj[key]))
}

export const getEntityClass = (type: string, entityClasses: EntityClasses): typeof GenericEntity => {
	const Class = <typeof GenericEntity><any>entityClasses[type]
	if (!Class) throw new Error(`Unknown entity class "${type}"`)
	return Class
}

export function pathBreakdown(path: string) {
	let dirpath = ""
	let filename = ""
	if (path.includes("/")) {
		const parts = path.split("/")
		filename = parts.pop()
		dirpath = parts.join("/") + "/"
	} else {
		filename = path
	}
	return {dirpath, filename}
}

export async function loadBabylonFile(scene, path: string, onProgress: (event: ProgressEvent) => void = event => {}) {
	SceneLoader.ShowLoadingScreen = false
	const {dirpath, filename} = pathBreakdown(path)
	return new Promise((resolve, reject) => {
		SceneLoader.Append(
			dirpath,
			filename,
			scene,
			() => resolve(),
			onProgress,
			() => reject(new Error(`Error loading babylon file: "${path}"`))
		)
	})
}

export async function loadBabylonMeshes(
	scene: Scene,
	path: string,
	onProgress: (event: SceneLoaderProgressEvent) => void = event => {}
) {
	SceneLoader.ShowLoadingScreen = false
	const meshNames = ""
	const {dirpath, filename} = pathBreakdown(path)
	return SceneLoader.ImportMeshAsync(meshNames, dirpath, filename, scene, onProgress)
}

// mixin decorator
export const mixin = (...sources: Function[]) => (target: Function) => {
	for (const source of sources) {
		for (const name of Object.getOwnPropertyNames(source.prototype))
			target.prototype[name] = source.prototype[name]
	}
}

export interface Service {
	destructor(): void
	start(): void
	stop(): void
}

export class ServiceMaster implements Service {
	private services: Service[]
	constructor(services: Service[]) {
		this.services = services
	}
	destructor() {
		for (const service of this.services) service.destructor()
	}
	start() {
		for (const service of this.services) service.start()
	}
	stop() {
		for (const service of this.services) service.stop()
	}
}

export const sleep = (milliseconds: number) =>
	new Promise((resolve, reject) => setTimeout(resolve, milliseconds))

export const environment: "browser" | "node" = new Function("try{return this===window}catch(e){return false}")()
	? "browser"
	: "node"

declare const process: any

export function now() {
	if (environment === "browser") return performance.now()
	else {
		const t = process.hrtime()
		return Math.round((t[0] * 1000) + (t[1] / 1000000))
	}
}

export const identical = (a, b) => JSON.stringify(a) === JSON.stringify(b)
