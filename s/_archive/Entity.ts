
import Game from './Game'
import World from './World'
import State from './State'
import Stage from './Stage'
import Logger from './Logger'
import {Tick} from './Ticker'
import WorldState from './WorldState'

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

  /** Immutable official data which describes this entity. */
  data: Object

  /** Mutable local copy of entity data, serving to indicate changes to be sent over the network. */
  delta: Object

  /** Incoming entity messages. */
  inbox: EntityMessage[]

  /** Outgoing entity messages. */
  outbox: EntityMessage[]

  /** Game instance. Entities can start/stop the game, add/remove entities, etc. */
  protected readonly game: Game

  /** World instance. Entities can query for and access other entity instances. */
  protected readonly world: World

  /** Stage instance. Entities can use the stage for rendering and to access Babylon components. */
  protected readonly stage: Stage

  /** Simple logging utility. */
  protected readonly logger: Logger

  /**
   * Create a new entity instance.
   * You can optionally provide your own label for each instance.
   */
  constructor(options: EntityOptions) {
    this.id = options.id
    this.tags = options.tags || []
    this.logger = options.logger
    this.game = options.game
    this.world = options.world
    this.stage = options.stage
  }

  /**
   * Clean up this entity for removal from the game.
   * Tear down any event subscriptions, etc.
   */
  destructor(): Promise<void> {
    return Promise.resolve()
  }

  worldStateDiff(state: WorldState): any {
    return {}
  }

  /**
   * Log formatting.
   */
  toString() { return `<${this.type}-${this.id}>` }

  /**
   * Logic tick routine.
   * Respond to fresh entity state.
   */
  abstract logic(tick: Tick): void
}

/** Export abstract class as default. */
export default Entity

/**
 * Options for creating an Entity.
 */
export interface EntityOptions {
  id: string
  data: EntityData
  tags?: string[]
  logger: Logger
  game: Game
  world: World
  stage: Stage
}

/**
 * Serializable networked message that messages can send to themselves.
 */
export interface EntityMessage {

  /** Sender and recipient of the message. You see, entities are always sending messages to themselves: they're trying to reach the version of themselves which is on the host machine. */
  entityId: string
}

/**
 * Input for entity logic.
 */
export interface EntityLogicInput {
  tick: Tick
}

/**
 * Entity's serializable, networkable, saveable state.
 */
export interface EntityData {
  type: string
  tags: string[]
}
