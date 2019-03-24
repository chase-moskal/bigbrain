
import * as babylon from "@babylonjs/core"
import {Manager} from "../../core/manager.js"
import {StickStore} from "../../core/overlay/stores/stick-store.js"
import {MainMenuStore} from "../../core/overlay/stores/main-menu-store.js"

import {RotatableNode, MovableNode} from "../tools/tools-interfaces.js"

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
