
import {Game} from "../game"
import {Cube} from "./entities/cube"
import {ModeOfConduct} from "../interfaces"
import {Ground, GroundEntry} from "./entities/ground"
import {Editor, EditorEntry} from "./entities/editor"

const game = new Game({
	mode: ModeOfConduct.Alone,
	canvas: document.querySelector("canvas"),
	overlay: document.querySelector(".overlay"),
	gravity: 9.8,
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

window.scrollTo(0, 1)
