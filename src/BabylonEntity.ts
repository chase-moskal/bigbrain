
import Entity, {EntityLogicInput, EntityLogicOutput} from 'Susa/Entity'
import BabylonGame from 'Susa/BabylonGame'
import BabylonStage from 'Susa/BabylonStage'

/**
 * Entity with access to Babylon components, via the Babylon stage.
 */
abstract class BabylonEntity extends Entity {

  /** Game instance. Entities can start/stop the game, add/remove entities, etc. */
  protected game: BabylonGame

  /** Stage instance. Entities can use it for rendering and access to Babylon components. */
  protected stage: BabylonStage

  /**
   * Empty logic routine is provided to cover the abstract one.
   */
  logic(input: EntityLogicInput): EntityLogicOutput {
    return {}
  }
}

/** Export default abstract class. */
export default BabylonEntity
