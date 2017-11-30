
import {StatePatch} from './State'
import {EntityMessage} from './Entity'

/**
 * Network component.
 * All game state changes are streaming through this component.
 * Perform necessary network interactions with the game state deltas, and stream back changes to our game state.
 */
export default class Network {

  /** Inbox array of network io packets which are ready to be received. */
  private inbox: GameUpdate[] = []

  /**
   * Receive official game updates from the network.
   */
  receive(): GameUpdate {
    return {
      patches: [],
      messages: []
    }
  }

  /**
   * Send local game update to the host.
   */
  send(update: GameUpdate) {}
}

/**
 * Information package which describes an update to the game.
 */
export interface GameUpdate {

  /** Patches representing changes to the world's state. */
  patches: StatePatch[]

  /** Messages for world entities. */
  messages: EntityMessage[]
}
