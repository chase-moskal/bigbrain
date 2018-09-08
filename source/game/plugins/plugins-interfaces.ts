
import * as babylon from "babylonjs"
import {Manager} from "../../manager"
import {StickStore} from "../../overlay/stores/stick-store"
import {MainMenuStore} from "../../overlay/stores/main-menu-store"
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
