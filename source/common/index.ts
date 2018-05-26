
import {makeGame} from "./game"
import {Cube, CubeEntry} from "./entities/cube"
import {Ground, GroundEntry} from "./entities/ground"
import {Editor, EditorEntry} from "./entities/editor"
import {Director, DirectorEntry} from "./entities/director"

import {Entity} from "../entity"

const {monarch} = makeGame({
	canvas: document.querySelector("canvas"),
	overlay: document.querySelector(".overlay"),
	entityClasses: {
		Cube,
		Editor,
		Director,
		Ground
	}
})

monarch.manager.addEntry<GroundEntry>({
	type: "Ground"
})

monarch.manager.addEntry<DirectorEntry>({
	type: "Director"
})

monarch.manager.addEntry<EditorEntry>({
	type: "Editor",
	bearings: {
		position: [0, 10, -5],
		rotation: [0, 0, 0, 0]
	}
})
