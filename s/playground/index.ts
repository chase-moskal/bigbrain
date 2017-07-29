
import Playground from "./Playground"
import Environment, {EnvironmentEntry} from "./Environment"
import Spectator, {SpectatorEntry} from "./Spectator"

const game = new Playground({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {Environment, Spectator}
})

game.susa.start()

game.addEntry<EnvironmentEntry>({
  type: "Environment",
  asset: "assets/playground.babylon"
})

game.addEntry<SpectatorEntry>({
  type: "Spectator",
  position: [0, 2, -5]
})

; (<any>window).game = game
