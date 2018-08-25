
import * as monarch from "."
import {
	Game,
	Cube,
	ModeOfConduct,
	Ground,
	GroundEntry,
	Editor,
	EditorEntry
} from "."

; (<any>window).monarch = monarch

; (<any>window).monarchDemo = function monarchDemo() {
	const game = new Game({
		mode: ModeOfConduct.Alone,
		canvas: document.querySelector("canvas"),
		overlay: document.querySelector(".overlay"),
		gravity: [0, -9.8, 0],
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
}
