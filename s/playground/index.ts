
import Playground from "./Playground"
import Environment, {EnvironmentEntry} from "./Environment"

const game = new Playground({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {Environment}
})

game.susa.start()
game.state.entries.set("a123", <EnvironmentEntry>{type: "Environment", asset: "assets/playground.babylon"})

; (<any>window).game = game
