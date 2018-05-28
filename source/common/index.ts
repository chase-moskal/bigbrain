
import {Game} from "../game"
import {ModeOfConduct} from "../interfaces"
import {Cube, CubeEntry} from "./entities/cube"
import {Ground, GroundEntry} from "./entities/ground"
import {Editor, EditorEntry} from "./entities/editor"

import {Entity} from "../entity"

const game = new Game({
	mode: ModeOfConduct.Alone,
	canvas: document.querySelector("canvas"),
	overlay: document.querySelector(".overlay"),
	entityClasses: {
		Cube,
		Editor,
		Ground
	}
})

game.manager.addEntry<GroundEntry>({
	type: "Ground"
})

game.manager.addEntry<EditorEntry>({
	type: "Editor",
	bearings: {
		position: [0, 10, -5],
		rotation: [0, 0, 0, 0]
	}
})
