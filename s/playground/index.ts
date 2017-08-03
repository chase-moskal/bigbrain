
import Playground from "./Playground"
import Spectator, {SpectatorEntry} from "./Spectator"
import Environment, {EnvironmentEntry} from "./Environment"

const game = new Playground({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {Environment, Spectator}
})

game.susa.start()

game.monarch.addEntry<EnvironmentEntry>({
  type: "Environment",
  asset: "assets/playground.babylon"
})

game.monarch.addEntry<SpectatorEntry>({
  type: "Spectator",
  position: [0, 2, -5]
})

; (<any>window).game = game
