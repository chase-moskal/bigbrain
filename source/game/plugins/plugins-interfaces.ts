
import * as babylon from "babylonjs"
import {Manager} from "../../manager"
import {StickStore, MainMenuStore} from "../../overlay/stores"
import {RotatableNode, MovableNode} from "../tools/tools-interfaces"

export interface LookPluginOptions {
	node: RotatableNode
	engine: babylon.Engine
	stickStore: StickStore
	mainMenuStore: MainMenuStore
}

export interface MovePluginOptions {
	node: MovableNode
	stickStore: StickStore
}

export interface PropPluginOptions {
	manager: Manager
	scene: babylon.Scene
	canvas: HTMLCanvasElement
}