
import {Mesh, ShadowGenerator, SpotLight, PhysicsImpostor, Scene} from "babylonjs"

import {Context} from "../game"
import {Entity} from "../../entity"
import {loadBabylonFile} from "../../toolbox"
import {StateEntry, Message} from "../../interfaces"
import {ElevationControl} from "../tools/elevation-control"
import {GroundMaterial, WaterMaterial} from "../tools/materials"

export interface TerrainEntry extends StateEntry {
	type: "Terrain"
	worldmongerPath: string
}

export class Terrain extends Entity<Context, TerrainEntry> {
	constructor(o) {
		super(o)
		const {entry} = this
		const {scene, canvas} = this.context
		this.makeTerrain(scene, canvas, entry)
	}

	private async makeTerrain(scene: Scene, canvas: HTMLCanvasElement, entry: TerrainEntry) {
		let mode = "CAMERA"
		const sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 100, 2), scene)
		const {worldmongerPath} = entry

		// Skybox
		const skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene)
		const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene)
		skyboxMaterial.backFaceCulling = false
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(`${worldmongerPath}/skybox/skybox`, scene)
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
		skyboxMaterial.disableLighting = true
		skybox.material = skyboxMaterial

		// Grounds
		const ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", `${worldmongerPath}/height-map.png`, 100, 100, 100, 0, 12, scene, true)
		const groundMaterial = new GroundMaterial("ground", scene, sun)
		ground.material = groundMaterial
		ground.position.y = -2.0

		const extraGround = BABYLON.Mesh.CreateGround("extraGround", 1000, 1000, 1, scene, false)
		const extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene)
		extraGroundMaterial.diffuseTexture = new BABYLON.Texture(`${worldmongerPath}/shaders/ground/sand.jpg`, scene)
		; (<any>extraGroundMaterial.diffuseTexture).uScale = 60
		; (<any>extraGroundMaterial.diffuseTexture).vScale = 60
		extraGround.position.y = -2.05
		extraGround.material = extraGroundMaterial

		// Water
		const water = BABYLON.Mesh.CreateGround("water", 1000, 1000, 1, scene, false)
		const waterMaterial = new WaterMaterial("water", scene, sun)
		waterMaterial.refractionTexture.renderList.push(ground)
		waterMaterial.refractionTexture.renderList.push(extraGround)

		waterMaterial.reflectionTexture.renderList.push(ground)
		waterMaterial.reflectionTexture.renderList.push(skybox)

		water.isPickable = false
		water.material = waterMaterial

		// Elevation
		const elevationControl = new ElevationControl(ground)

		// // Bloom
		// var blurWidth = 16.0

		// var postProcess0 = new BABYLON.PassPostProcess("Scene copy", 1.0, camera)
		// var postProcess1 = new BABYLON.PostProcess("Down sample", "./postprocesses/downsample", ["screenSize", "highlightThreshold"], null, 0.5, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE)
		// postProcess1.onApply = function (effect) {
		// 	effect.setFloat2("screenSize", postProcess1.width, postProcess1.height)
		// 	effect.setFloat("highlightThreshold", 0.85)
		// }
		// var postProcess2 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), blurWidth, 0.5, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE)
		// var postProcess3 = new BABYLON.BlurPostProcess("Vertical blur", new BABYLON.Vector2(0, 1.0), blurWidth, 0.5, camera, BABYLON.Texture.DEFAULT_SAMPLINGMODE)
		// var postProcess4 = new BABYLON.PostProcess("Final compose", "./postprocesses/compose", ["sceneIntensity", "glowIntensity", "highlightIntensity"], ["sceneSampler"], 1, camera)
		// postProcess4.onApply = function (effect) {
		// 	effect.setTextureFromPostProcess("sceneSampler", postProcess0)
		// 	effect.setFloat("sceneIntensity", 0.8)
		// 	effect.setFloat("glowIntensity", 0.6)
		// 	effect.setFloat("highlightIntensity", 1.5)
		// }

		// // Render loop
		// var renderFunction = function () {
		// 	if (ground.isReady && ground.subMeshes.length == 1) {
		// 		ground.subdivide(20)    // Subdivide to optimize picking
		// 	}

		// 	// Camera
		// 	if (camera.beta < 0.1)
		// 		camera.beta = 0.1
		// 	else if (camera.beta > (Math.PI / 2) * 0.92)
		// 		camera.beta = (Math.PI / 2) * 0.92

		// 	if (camera.radius > 70)
		// 		camera.radius = 70

		// 	if (camera.radius < 5)
		// 		camera.radius = 5

		// 	// Fps
		// 	divFps.innerHTML = engine.getFps().toFixed() + " fps"

		// 	// Render scene
		// 	scene.render()

		// 	// Animations
		// 	skybox.rotation.y += 0.0001 * scene.getAnimationRatio()
		// }

		// // Launch render loop
		// scene.executeWhenReady(function() {
		// 	engine.runRenderLoop(renderFunction)
		// })

		// // Resize
		// window.addEventListener("resize", function () {
		// 	engine.resize()
		// })

		// // UI
		// var cameraButton = document.getElementById("cameraButton")
		// var elevationButton = document.getElementById("elevationButton")
		// var digButton = document.getElementById("digButton")
		// var help01 = document.getElementById("help01")
		// var help02 = document.getElementById("help02")

		// window.oncontextmenu = function () {
		// 	return false
		// }

		// cameraButton.addEventListener("pointerdown", function () {
		// 	if (mode == "CAMERA")
		// 		return
		// 	camera.attachControl(canvas)
		// 	elevationControl.detachControl(canvas)

		// 	mode = "CAMERA"
		// 	cameraButton.className = "controlButton selected"
		// 	digButton.className = "controlButton"
		// 	elevationButton.className = "controlButton"
		// })

		// elevationButton.addEventListener("pointerdown", function () {
		// 	help01.className = "help"
		// 	help02.className = "help"

		// 	if (mode == "ELEVATION")
		// 		return

		// 	if (mode == "CAMERA") {
		// 		camera.detachControl(canvas)
		// 		elevationControl.attachControl(canvas)
		// 	}

		// 	mode = "ELEVATION"
		// 	elevationControl.direction = 1

		// 	elevationButton.className = "controlButton selected"
		// 	digButton.className = "controlButton"
		// 	cameraButton.className = "controlButton"
		// })

		// digButton.addEventListener("pointerdown", function () {
		// 	help01.className = "help"
		// 	help02.className = "help"

		// 	if (mode == "DIG")
		// 		return

		// 	if (mode == "CAMERA") {
		// 		camera.detachControl(canvas)
		// 		elevationControl.attachControl(canvas)
		// 	}

		// 	mode = "DIG"
		// 	elevationControl.direction = -1

		// 	digButton.className = "controlButton selected"
		// 	elevationButton.className = "controlButton"
		// 	cameraButton.className = "controlButton"
		// })

		// // Sliders
		// $("#slider-vertical").slider({
		// 	orientation: "vertical",
		// 	range: "min",
		// 	min: 2,
		// 	max: 15,
		// 	value: 5,
		// 	slide: function (event, ui) {
		// 		elevationControl.radius = ui.value
		// 	}
		// })

		// $("#slider-range").slider({
		// 	orientation: "vertical",
		// 	range: true,
		// 	min: 0,
		// 	max: 12,
		// 	values: [0, 11],
		// 	slide: function (event, ui) {
		// 		elevationControl.heightMin = ui.values[0]
		// 		elevationControl.heightMax = ui.values[1]
		// 	}
		// })

		// $("#qualitySlider").slider({
		// 	orientation: "vertical",
		// 	range: "min",
		// 	min: 0,
		// 	max: 3,
		// 	value: 3,
		// 	slide: function (event, ui) {
		// 		switch (ui.value) {
		// 			case 3:
		// 				waterMaterial.refractionTexture.resize(512, true)
		// 				waterMaterial.reflectionTexture.resize(512, true)
		// 				scene.getEngine().setHardwareScalingLevel(1)
		// 				scene.particlesEnabled = true
		// 				scene.postProcessesEnabled = true
		// 				break
		// 			case 2:
		// 				waterMaterial.refractionTexture.resize(256, true)
		// 				waterMaterial.reflectionTexture.resize(256, true)
		// 				scene.getEngine().setHardwareScalingLevel(1)
		// 				scene.particlesEnabled = false
		// 				scene.postProcessesEnabled = false
		// 				break
		// 			case 1:
		// 				waterMaterial.refractionTexture.resize(256, true)
		// 				waterMaterial.reflectionTexture.resize(256, true)
		// 				scene.getEngine().setHardwareScalingLevel(2)
		// 				scene.particlesEnabled = false
		// 				scene.postProcessesEnabled = false
		// 				break
		// 			case 0:
		// 				waterMaterial.refractionTexture.resize(256, true)
		// 				waterMaterial.reflectionTexture.resize(256, true)
		// 				scene.getEngine().setHardwareScalingLevel(3)
		// 				scene.particlesEnabled = false
		// 				scene.postProcessesEnabled = false
		// 				break
		// 		}
		// 	}
		// })
	}

	async destructor() {}
}
