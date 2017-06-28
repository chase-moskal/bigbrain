
# Monarch Game Engine — [![Build Status](https://travis-ci.org/AkkadianGames/Susa.svg?branch=master)](https://travis-ci.org/AkkadianGames/Susa)

## Concept engine of Chase Moskal's dreams

 - Unstable hobby project
 - Built on top of the mighty [BabylonJS](http://www.babylonjs.com/) 3D web game engine
 - TypeScript

## Networked multiplayer concept architecture

```
╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮
╎          ~ HOST ~              ╎              ~ CLIENT ~        ╎
╎          ========              ╎              ==========        ╎
╎                                ╎                                ╎
╎     (Update: Requests)         ╎     (Update: State + Mandates) ╎
╎    ╭──────────────────╮        ╎        ╭──────────────────╮    ╎
╎    │                  │        ╎        │                  │    ╎
╎    │             ╔═════════╗   ╎   ╔═════════╗             │    ╎
╎    │             ║ NETWORK ║   ╎   ║ NETWORK ║             │    ╎
╎    │             ║    ▲    ║   ╎   ║    ▲    ║             │    ╎
╎    ▼             ║    ╰─[recv] ╎ [recv]─╯    ║             ▼    ╎
╎ ╔═══════════╗    ║       ▲ ║  ╲╎╱  ║         ║    ╔═══════════╗ ╎
╎ ║ SIMULATOR ║    ║       │ ║   ╳   ║         ║    ║ SIMULATOR ║ ╎
╎ ╚═══════════╝    ║       │ ║  ╱╎╲  ║         ║    ╚═══════════╝ ╎
╎    │             ║    ╭►[send] ╎ [send]◄╮    ║             │    ╎
╎    │             ║    │    ║   ╎   ║    │    ║             │    ╎
╎    │             ╚═════════╝   ╎   ╚═════════╝             │    ╎
╎    │                  ▲        ╎        ▲                  │    ╎
╎    ╰──────────────────╯        ╎        ╰──────────────────╯    ╎
╎  (Update: State + Mandates)    ╎         (Update: Requests)     ╎
╎                                ╎                                ╎
╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯
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
