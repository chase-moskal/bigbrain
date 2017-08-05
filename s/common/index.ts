
import Game from "./game"

import Cube, {CubeEntry} from "./entities/cube"
import Editor, {EditorEntry} from "./entities/editor"
import Spectator, {SpectatorEntry} from "./entities/spectator"
import Environment, {EnvironmentEntry} from "./entities/environment"

const game = new Game({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {Environment, Spectator, Editor, Cube}
})

game.susa.start()

game.monarch.addEntry<EnvironmentEntry>({
  type: "Environment",
  asset: "assets/playground.babylon"
})

game.monarch.addEntry<EditorEntry>({
  type: "Editor",
  position: [0, 2, -5]
})

; (<any>window).game = game
