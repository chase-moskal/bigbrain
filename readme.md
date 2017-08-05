
# MONARCH GAME ENGINE — [![Build Status](https://travis-ci.org/monarch-games/engine.svg?branch=master)](https://travis-ci.org/monarch-games/engine)

## ***[» play now «](https://monarch-games.github.io/engine/)***

 - WASD and the mouse to fly around
 - hold E key and click to place cubes
 - remove them by looking at them and pressing X

## concept engine of chase moskal's dreams

 - built on top of the mighty [babylonjs](http://www.babylonjs.com/) web game engine
 - wip — unstable hobby project

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
