
# MONARCH ENGINE — [![Build Status](https://travis-ci.org/monarch-games/engine.svg?branch=master)](https://travis-ci.org/monarch-games/engine)

## ***[» play now «](https://monarch-games.github.io/engine/)***

**concept game engine of chase moskal's dreams** *(unstable wip project)*
- WASD and the mouse to fly around
- hold E key and click to place cubes
- remove them by looking at them and pressing X

## monarch engine architecture

### *SUSA* — `monarch/dist/susa`

- takes an html canvas element, and creates the 3d world
- binds events to the window, to handle input locking, game pausing etc
- built on top of the mighty [babylonjs](http://www.babylonjs.com/) web game engine

### *ENTITIES* — `monarch/entities`

- everything in the game world is an entity
- entities react (via mobx) to observable changes in the entity's state
- entities are networked -- client entities can send messages to their host counterparts

## monarch physics architecture

- [bullet physics](https://github.com/bulletphysics/bullet3) via [ammo.js](https://github.com/kripken/ammo.js/)
- physics work happens in a web worker
- ammo.js is required as an external global bundle

```
(main thread liaison)
   ┌─────────┐    ORDERS
   │ MANAGER │───────┐
   └─────────┘       │
        ▲            ▼
        │        ┌────────┐
        └────────│ WORKER │
      RESULTS    └────────┘
          (physics sim thread)
```

****
- **manager** — allows you to send orders to the physics simulation, and subscribe to updates
	- runs synchronously on the main javascript thread
- **worker** — worker thread, runs the physics simulation asynchronously in the background
	- receiving `orders` from the manager, sending back `results`
- **orders** — commands to control the physics simulation
	- *start simulation* – allow the simulation to run (optionally set the simulation timescale/speed)
	- *stop simulation* – halt/pause the simulation
	- *add body* – add a new physics body to the simulation (returns new body id as a result)
	- *remove body* – remove a physics body from the simulation (by body id)
	- *update body* – update the properties of a physics body, such as position (by body id)
- **results** — position and rotation updates from the physics simulation

## monarch state architecture

monarch's entities observe and respond to game state]

in a networked or local game, all causational actions are requested in `messages`

```
┌─────────────────────────────────────────────────────────────────┐
│          ~ HOST ~              │              ~ CLIENT ~        │
│          ========              │              ==========        │
│                                │                                │
│     (Update: Messages)         │         (Update: Messages)     │
│    ┌──────────────────┐        │        ┌──────────────────┐    │
│    │                  │        │        ▼                  │    │
│    │             ╔═════════╗   │   ╔═════════╗             │    │
│    │             ║ NETWORK ║   │   ║ NETWORK ║             │    │
│    │             ║    ▲    ║   │   ║    │    ║             │    │
│    ▼             ║    └─[recv]◄┼─[send]─┘    ║             │    │
│ ╔═══════════╗    ║       ▲ ║   │   ║         ║    ╔═══════════╗ │
│ ║ SIMULATOR ║    ║       │ ║   │   ║         ║    ║ SIMULATOR ║ │
│ ╚═══════════╝    ║       │ ║   │   ║         ║    ╚═══════════╝ │
│    │             ║    ┌►[send]─┼►[recv]─┐    ║             ▲    │
│    │             ║    │    ║   │   ║    ▼    ║             │    │
│    │             ╚═════════╝   │   ╚═════════╝             │    │
│    │                  ▲        │        │                  │    │
│    └──────────────────┘        │        └──────────────────┘    │
│  (Update: State + Messages)    │     (Update: State + Messages) │
│                                │                                │
└─────────────────────────────────────────────────────────────────┘
```

- **unidirectional data flow** — all causational actions are propagated via `messages` to the host simulator
- **mobx observables** — entities in the game engine use mobx to observe and respond to changes in the game state
