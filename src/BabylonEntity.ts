
import Entity from 'Susa/Entity'
import BabylonStage from 'Susa/BabylonStage'

/** Export default abstract class. */
export default BabylonEntity

/**
 * Entity with access to Babylon components, via the Babylon stage.
 */
abstract class BabylonEntity extends Entity {

  /** Stage instance through which the entity accesses Babylon components (engine, scene, etc). */
  protected stage: BabylonStage
}
