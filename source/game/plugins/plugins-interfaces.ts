
import * as babylon from "babylonjs"
import {Manager} from "../../manager"
import {RotatableNode, MovableNode} from "../tools/tools-interfaces"

export interface LookPluginOptions {
	node: RotatableNode
	engine: babylon.Engine
	stickZone: HTMLElement
}

export interface MovePluginOptions {
	node: MovableNode
	stickZone: HTMLElement
}

export interface PropPluginOptions {
	manager: Manager
	scene: babylon.Scene
	canvas: HTMLCanvasElement
}
