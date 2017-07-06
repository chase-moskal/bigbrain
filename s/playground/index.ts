
import Playground from "./Playground"
import Cube, {CubeEntry} from "./Cube"
import Environment, {EnvironmentEntry} from "./Environment"

const game = new Playground({
  window,
  canvas: document.querySelector("canvas"),
  state: {
    A123: <EnvironmentEntry>{type: "Environment"}
  },
  entityClasses: {Environment}
})

game.start()

; (<any>window).game = game
