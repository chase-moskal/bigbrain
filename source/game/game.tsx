
import {h} from "preact"
import * as preact from "preact"
import * as cannon from "cannon"
import * as babylon from "babylonjs"

import {GameOptions, GameContext} from "./game-interfaces"

import {Ticker} from "../ticker"
import {Service} from "../toolbox"
import {Manager} from "../manager"
import {Overlay} from "../overlay"
import {Viewport} from "../viewport"
import {Conductor} from "../conductor"
import {OverlayStore} from "../overlay/stores/overlay-store"
import {StatisticsStore} from "../overlay/stores/statistics-store"

/**
 * Standard monarch game
 */
export class Game implements Service {
	readonly manager: Manager
	private readonly viewport: Viewport
	private readonly logicTicker: Ticker

	constructor(options: GameOptions) {
		const {overlayElement, canvas, mode, entityClasses, gravity} = options

		// babylon engine as the foundation
		const engine = new babylon.Engine(canvas, true, undefined, true)
		const scene = new babylon.Scene(engine)

		// cannon physics enabled
		const physicsPlugin = new babylon.CannonJSPlugin()
		const physicsWorld: cannon.World = physicsPlugin.world
		physicsWorld.allowSleep = true
		physicsWorld.broadphase = new cannon.SAPBroadphase(physicsWorld)
		scene.enablePhysics(babylon.Vector3.FromArray(gravity), physicsPlugin)

		// viewport handles render loop and pointer lock
		const viewport = this.viewport = new Viewport({
			window,
			canvas,
			scene,
			engine
		})

		// 2d overlay
		const statisticsStore = new StatisticsStore()
		const overlayStore = new OverlayStore({statisticsStore})
		const {mainMenuStore} = overlayStore
		preact.render(
			<Overlay {...{overlayStore}}/>,
			undefined,
			overlayElement
		)

		// conductor keeps gamestate and entity replication
		const conductor = new Conductor<GameContext>({
			mode,
			entityClasses,
			context: {
				scene,
				window,
				canvas,
				engine,
				physicsWorld,
				overlayStore,
				mainMenuStore
			}
		})

		// make the logic ticker
		this.logicTicker = this.makeLogicTicker({
			viewport,
			conductor,
			statisticsStore,
			durationBetweenTicks: 0,
			timeBetweenStatRecordings: 0
		})

		// expose the state manager
		this.manager = conductor.manager
	}

	start() {
		this.logicTicker.start()
		this.viewport.start()
	}

	stop() {
		this.logicTicker.stop()
		this.viewport.stop()
	}

	destructor() {
		this.logicTicker.destructor()
		this.viewport.destructor()
	}

	private makeLogicTicker({
		viewport,
		conductor,
		statisticsStore,
		durationBetweenTicks,
		timeBetweenStatRecordings
	}: {
		viewport: Viewport
		conductor: Conductor
		statisticsStore: StatisticsStore
		durationBetweenTicks?: number
		timeBetweenStatRecordings?: number
	}) {
		let statmark = 0
		let ticker
		return ticker = new Ticker({
			tickAction: tick => {
				conductor.logic(tick)
				if (ticker && tick.timeline - statmark > timeBetweenStatRecordings) {
					statisticsStore.recordTickerStats(ticker)
					statisticsStore.recordViewportStats(viewport)
					statmark = tick.timeline
				}
			},
			durationBetweenTicks
		})
	}
}