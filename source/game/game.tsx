
import {h} from "preact"
import * as preact from "preact"
import babylon from "../babylon"

import {GameOptions, GameContext} from "./game-interfaces"

import {Ticker} from "../core/ticker"
import {Manager} from "../core/manager"
import {Viewport} from "../core/viewport"
import {Conductor} from "../core/conductor"
import {Overlay} from "../core/overlay/components/overlay"
import {Service} from "../core/toolbox/toolbox-interfaces"
import {ServiceMaster} from "../core/toolbox/service-master"
import {OverlayStore} from "../core/overlay/stores/overlay-store"
import {StatisticsStore} from "../core/overlay/stores/statistics-store"

/**
 * Standard monarch game
 */
export class Game extends ServiceMaster implements Service {
	readonly manager: Manager

	constructor(options: GameOptions) {
		super()
		const {
			mode,
			canvas,
			gravity,
			entityClasses,
			overlayElement,
			maxSlowTickRate,
			maxLogicTickRate,
			maxHyperTickRate
		} = options

		// babylon engine as the foundation
		const engine = new babylon.Engine(canvas, true, undefined, true)
		const scene = new babylon.Scene(engine)

		const gravityVector = babylon.Vector3.FromArray(gravity)
		const physicsPlugin = new babylon.AmmoJSPlugin()
		const physicsWorld = physicsPlugin.world
		scene.enablePhysics(gravityVector, physicsPlugin)

		// viewport handles render loop and pointer lock
		const viewport = new Viewport({
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

		const {logicTicker, hyperTicker, slowTicker} = this.makeTickers({
			maxLogicTickRate,
			maxHyperTickRate,
			maxSlowTickRate,
			viewport,
			conductor,
			statisticsStore
		})

		this.services = [
			viewport,
			logicTicker,
			hyperTicker,
			slowTicker
		]

		this.manager = conductor.manager
	}

	private makeTickers({
		maxLogicTickRate,
		maxHyperTickRate,
		maxSlowTickRate,
		viewport,
		conductor,
		statisticsStore
	}: {
		maxLogicTickRate: number
		maxHyperTickRate: number
		maxSlowTickRate: number
		viewport: Viewport
		conductor: Conductor
		statisticsStore: StatisticsStore
		statPeriod?: number
	}) {
		const logicTicker = new Ticker({
			period: 1000 / maxLogicTickRate,
			tickAction: tickInfo => conductor.logicTick(tickInfo)
		})

		const hyperTicker = new Ticker({
			period: 1000 / maxHyperTickRate,
			tickAction: tickInfo => conductor.hyperTick(tickInfo)
		})

		const slowTicker = new Ticker({
			period: 1000 / maxSlowTickRate,
			tickAction: tickInfo => {
				conductor.hyperTick(tickInfo)

				// track statistics
				// TODO split this into its own stats entity, rather than hard-coding it
				statisticsStore.recordTickerStats({
					timeline: logicTicker.timeline,
					slowTickRate: slowTicker.tickRate,
					logicTickRate: logicTicker.tickRate,
					hyperTickRate: hyperTicker.tickRate,
					renderFrameRate: viewport.renderFrameRate
				})
			}
		})

		return {logicTicker, hyperTicker, slowTicker}
	}
}
