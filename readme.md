
# monarch-engine [![build status](https://travis-ci.org/monarch-games/engine.svg?branch=master)](https://travis-ci.org/monarch-games/engine)<br/><small><em>web game engine of chase moskal's dreams</em></small>

- [x] open source game engine
- [x] mobile first
- [x] built on [babylonjs](https://github.com/BabylonJS/Babylon.js)
- [x] json game state system
- [x] entity class instancing system
- [x] basic fps control for flying editor
- [ ] achieve satisfaction with architecture fundamentals
- [ ] multiplayer
- [ ] collaborative map editor

### [**🎮 play engine demo now**](https://monarch-games.github.io/engine/)

- wasd and the mouse to fly around
- shift to sprint, c and space to sink and rise
- hold e key and click to place cubes
- remove them by looking at them and pressing x

### [**🔫 nanoshooter will be the first monarch game**](https://github.com/monarch-games/nanoshooter)

- we're making this 3d tank game to demonstrate the engine's capabilities
- this game is open source

### [**📦 npm install monarch-engine**](https://www.npmjs.com/package/monarch-engine)

- build your own games on monarch-engine
- written in typescript (explicit interfaces)
- umd modules

## engine development instructions

these are instructions for working on monarch engine itself —  
if instead you want to build your own game using monarch engine, you want to fork [nanoshooter](https://github.com/monarch-games/nanoshooter)

- install prerequisites
	- [git](https://git-scm.com/)
	- [node 10](https://nodejs.org/en/)
	- [vs code](https://code.visualstudio.com/)
- remember to set up your github account [ssh keys](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)
- clone and build the engine project
	- `git clone git@github.com:monarch-games/engine.git`
	- `npm install`
- start local dev server and launch the demo
	- `npm start`
	- launch [http://localhost:8080/](http://localhost:8080/)
- install the [babylon blender exporter](https://github.com/BabylonJS/Exporters/tree/master/Blender) to create 3d assets

### command line routines

- `npm install`  
	*"production build"*  
	optimal production build and a test run  
	also installs any missing project dependencies  
	*available as task in vs code*

- `npm run build-debug`  
	*"debug build"*  
	produces fat debuggable bundle (source maps included)  
	*available as task in vs code (ctrl+shift+b)*

### technical goals, future features, notes

- **asset preview system**  
	load engine demo page with `#preview="assets/powercube.babylon"`  
	and it will load the asset into a preview scene  
	should be easy to implement in downstream games like nanoshooter

- **user-interface system**  
	2d overlay ui, slideout panel  
	for settings menus, map editor functionality, and more  
	powered by preact components and mobx stores

- **universal game settings**  
	game settings like mouse sensitivity, volume, resolution, anything like that

- **basic prop editing**  
	mobile-friendly interface for adding and deleting various props  
	ui work involves selection from a listing of available props  
	and organizing their proposal meshes

- **enhance state entry definitions**  
	use observable mobx store classes and [mobx serializr](https://github.com/mobxjs/serializr)

- **manager method to add an entity** to the game world  
	returns a promise which resolves with the replicated entity instance

- **webrtc datachannel multiplayer collaborative editing**  
	rig up a shared multiplayer game state  
	allow multiple editors to fly around and see each other  
	represented by a flying cone or something  
	no work on data optimization yet, just sending large json chunks

- **draw up an 'engine theory' diagram**  
	to make clear how monarch is lean, flexible, extensible
