
import Logger from 'Susa/Toolbox/Logger'
import Game from 'Susa/Game'
import World from 'Susa/World'
import State from 'Susa/State'
import Stage from 'Susa/Stage'
import {TickReport} from 'Susa/Toolbox/Ticker'

/** Export abstract class as default. */
export default Entity

/**
 * Entity in the game world which responds to fresh entity state on logic ticks.
 * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
 */
abstract class Entity {

  /** Module ID for this entity class. Used to load entity classes on-the-fly. */
  static readonly type: string = 'Nanoshooter/Entities/Entity'

  /** Module ID for this entity class. Copied from the static variable. */
  readonly type: string = (<typeof Entity>this.constructor).type

  /** Unique ID tag. */
  readonly id: string

  /** Searchable tag strings related to this entity. Optional. */
  readonly tags: string[]

  /** Simple logging utility. */
  protected readonly logger: Logger

  /** World instance. Entities can query for and access other entity instances. */
  protected readonly world: World

  /** Stage instance. Entities have full access to the Babylon API that the stage exposes. */
  protected readonly stage: Stage

  /**
   * Create a new entity instance.
   * You can optionally provide your own label for each instance.
   */
  constructor(options: EntityOptions) {
    this.id = options.id
    this.tags = options.tags || []
    this.logger = options.logger
    this.world = options.world
    this.stage = options.stage
  }

  /**
   * Clean up this entity for removal from the game.
   * Tear down any event subscriptions, etc.
   */
  destructor() {}

  /**
   * Log formatting.
   */
  toString() { return `<${this.type}-${this.id}>` }

  /**
   * Logic tick routine.
   * Respond to fresh entity state.
   */
  abstract logic(input: EntityLogicInput): EntityLogicOutput
}

/**
 * Options for creating an Entity.
 */
export interface EntityOptions {
  id: string
  entityState: EntityState
  tags?: string[]
  logger: Logger
  world: World
  stage: Stage
}

/**
 * Input for entity logic.
 */
export interface EntityLogicInput {
  state: EntityState
  tickReport: TickReport
}

/**
 * Output from entity logic.
 */
export interface EntityLogicOutput {
  entityStateDelta: any
}

/**
 * Entity's serializable, networkable, saveable state.
 */
export interface EntityState {
  type: string
  tags?: string[]
}
