
import Game from "./game"

import Cube, {CubeEntry} from "./entities/cube"
import Agent, {AgentEntry} from "./entities/agent"
import Editor, {EditorEntry} from "./entities/editor"
import Director, {DirectorEntry} from "./entities/director"
import Spectator, {SpectatorEntry} from "./entities/spectator"
import Environment, {EnvironmentEntry} from "./entities/environment"

const game = new Game({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {
    Environment,
    Spectator,
    Editor,
    Cube,
    Director,
    Agent
  }
})

const {manager} = game

manager.addEntry<EnvironmentEntry>({
  type: "Environment",
  asset: "assets/playground.babylon"
})

manager.addEntry<DirectorEntry>({
  type: "Director"
})

manager.addEntry<EditorEntry>({
  type: "Editor",
  position: [0, 2, -5]
})

; (<any>window).game = game
