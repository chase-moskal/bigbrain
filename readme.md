
# monarch is in its cocooon

## what does a monarch user want?

- i want a simple `<monarch-game>` element to start building my online game

  - it consolidates and manages the follow subcomponents
    - viewport
    - overlay
    - netstate
    - simulator

  - pass in your game's entities
    - register your entity subclasses, and add them to the game world
    - your entities use babylonjs for interacting with the 3d world
    - several events are published for things in the game world

  - networking is easy
    - just set some connection attributes
    - comes with a standard server browser interface

  - ergonomic methods are provided
    - like `game.add` to add entities into the game world

- sometimes i want to avoid the web component and want more control over the game

  - this allows you to use engines other than babylon

  - in this case the users put together the game manually
    - instance a netstate
    - instance a viewport and install the canvas
    - instance a simulator, provide netstate, game context, and entity subclasses
    - insert stuff into the netstate to watch it manifest

  - this method is more fundamental, and therefor "comes first"

- i want to write cool entities
  - how it works generally
    - all entities are given a shared context object, to access babylon and such
    - entities can participate in a logic loop
    - entities are either in 'host' state or 'client' state
    - host entities can manipulate their own state entries
    - the netstate will automatically synchronize any changes
    - client entities have readonly state, and must send messages to the host entity to request any changes
    - host entities can send messages to themselves, but this isn't a required pattern
    - host entities implement `onMessage` to handle messages
    - all entities can implement callbacks to react to changing state or other events
  - your entity classes should implement
    - `onInsertion()` state entry has been inserted (aka onInit)
    - `onUpdate()` state entry is updated
    - `onRemoval()` state entry has been removed, entity dies now
    - `onMessage(message)` receive an entity message (is only called when host)
  - your entity classes should utilize
    - `sendMessage(mode: "reliable", message)` send a message either "quick" or "reliable"

## state theory

```ts

class MonarchGame extends LitElement {
  private _overlay: Overlay
  private _viewport: Viewport
  private _netstate: Netstate
  private _simulator: Simulator

  constructor({connection}) {
    const overlay = this._overlay = new Overlay()
    const viewport = this._viewport = new Viewport({overlay})
    const netstate = this._netstate = new Netstate({connection})
    const simulator = this._simulator = new Simulator({netstate})
  }

  async add<T extends Entity>(EntitySubclass: typeof T, data: any): Promise<T> {
    return this._simulator.insert(EntitySubclass, data)
  }

  async remove(id: number): Promise<void> {
    return this._simulator.remove(id)
  }
}

```
