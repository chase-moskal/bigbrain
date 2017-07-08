
# Monarch Game Engine — [![Build Status](https://travis-ci.org/monarch-games/engine.svg?branch=master)](https://travis-ci.org/monarch-games/engine)

## concept engine of chase moskal's dreams

 - unstable hobby project
 - built on top of the mighty [babylonjs](http://www.babylonjs.com/) web game engine
 - typescript

## network architecture design

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

### SIMULATOR

 - COMMON
    - simulator conforms to state (adds/removes entities)
    - entities react to mandate messages from host
 - HOST
    - entities perform game simulation
    - entities react to request messages
    - entities write new state for everyone
    - entities write mandate messages for everyone
 - CLIENT
    - entities mimic state entries
    - entities write request messages for host

### NETWORK

 - HOST
    - all sent updates are looped back into recv
    - the host thus receives their own updates
    - updates from clients are also ingested
 - CLIENT
    - received updates are simply fed into the simulator
    - updates that come out of the simulator have only request messages
    - these updates are sent to the host
