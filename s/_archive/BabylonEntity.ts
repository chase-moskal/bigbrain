
import {Tick} from './Ticker'
import BabylonGame from './BabylonGame'
import BabylonStage from './BabylonStage'
import Entity, {EntityLogicInput} from './Entity'

/**
 * Entity with access to Babylon components, via the Babylon stage.
 */
abstract class BabylonEntity extends Entity {

  /** Game instance. Entities can start/stop the game, add/remove entities, etc. */
  protected game: BabylonGame

  /** Stage instance. Entities can use it for rendering and access to Babylon components. */
  protected stage: BabylonStage

  /**
   * Entity logic routine.
   */
  logic(tick: Tick): void {}
}

/** Export default abstract class. */
export default BabylonEntity
