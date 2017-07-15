
import Playground from "./Playground"
import Environment, {EnvironmentEntry} from "./Environment"

const game = new Playground({
  window,
  canvas: document.querySelector("canvas"),
  state: {
    A123: <EnvironmentEntry>{
      type: "Environment",
      babylonFile: "assets/playground.babylon"
    }
  },
  entityClasses: {Environment}
})

game.start()

; (<any>window).game = game
