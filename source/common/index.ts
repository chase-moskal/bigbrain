
import {makeGame} from "./game"
import {Cube, CubeEntry} from "./entities/cube"
import {Agent, AgentEntry} from "./entities/agent"
import {Editor, EditorEntry} from "./entities/editor"
import {Terrain, TerrainEntry} from "./entities/terrain"
import {Director, DirectorEntry} from "./entities/director"
import {Spectator, SpectatorEntry} from "./entities/spectator"
import {Environment, EnvironmentEntry} from "./entities/environment"

import {Entity} from "../entity"

const {monarch} = makeGame({
	canvas: document.querySelector("canvas"),
	entityClasses: {
		Cube,
		Agent,
		Terrain,
		Editor,
		Director,
		Spectator,
		Environment
	}
})

monarch.manager.addEntry<TerrainEntry>({
	type: "Terrain",
	worldmongerPath: "assets/worldmonger"
})

monarch.manager.addEntry<DirectorEntry>({
	type: "Director"
})

monarch.manager.addEntry<EditorEntry>({
	type: "Editor",
	bearings: {
		position: [0, 25, -5],
		rotation: [0, 0, 0, 0]
	}
})
