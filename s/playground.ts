
import Susa from "./Susa"
import Ticker from "./Ticker"
import Simulator from "./Simulator"
import {Engine, Scene} from "babylonjs"
import {LoopbackNetwork} from "./Network"
import Monarch, {Context} from "./Monarch"
import {Entity, GenericEntity, EntityClasses} from "./Entity"

interface SusaContext extends Context {
  scene: Scene
}

class Dog extends Entity {
  protected readonly context: SusaContext

  logic({tick, entry, messages}) {
    if (this.context.host) {}
    return {entry, messages: []}
  }

  destructor() {}
}

function makePlayground() {

  // make susa
  const canvas = document.createElement("canvas")
  const engine = new Engine(canvas, true)
  const scene = new Scene(engine)
  const susa = new Susa({canvas, engine, scene})

  // make monarch, with susa registered as a service
  const context: SusaContext = {host: true, scene}
  const ticker = new Ticker()
  const network = new LoopbackNetwork({context: <SusaContext>{host: true, scene}, state: {}})
  const simulator = new Simulator({context, entityClasses: {Dog}})
  const monarch = new Monarch({ticker, network, simulator, services: [susa]})

  return {monarch, susa, context}
}

