
# monarch-engine [![build status](https://travis-ci.org/monarch-games/engine.svg?branch=master)](https://travis-ci.org/monarch-games/engine)

### concept web game engine of chase moskal's dreams

- open source game engine
- multiplayer
- collaborative map editor
- mobile-first
- built on [babylonjs](https://github.com/BabylonJS/Babylon.js)

### [**🎮 play engine demo now**](https://monarch-games.github.io/engine/)

- wasd and the mouse to fly around
- hold e key and click to place cubes
- remove them by looking at them and pressing x

### [**🔫 nanoshooter will be the first monarch game**](https://github.com/monarch-games/nanoshooter)

- we're making this 3d tank game to demonstrate the engine's capabilities
- this game is open source
- built on babylonjs

### [**📦 npm install monarch-engine**](https://www.npmjs.com/package/monarch-engine)

- build your own games on monarch-engine
- umd modules

### developing the engine in this repository itself

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

### command line or vs code tasks

- `npm install`  
	*"production build"*  
	optimal production build and a test run  
	also installs any missing project dependencies  
	*available as task in vs code*

- `npm run build-debug`  
	*"debug build"*  
	produces fat debuggable bundle (source maps included)  
	also available in vs code as a task, or hit ctrl-shift-b
