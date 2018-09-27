
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {MainMenuProps} from "./components-interfaces"
import {StatisticsStore} from "../stores/statistics-store"

@observer
export class MainMenu extends Component<MainMenuProps> {

	render() {
		const {statisticsStore} = this.props.store
		return (
			<div className="main-menu">
				{this.renderLookSensitivitySetting()}
				<Statistics {...{statisticsStore}}/>
			</div>
		)
	}

	private handleLookSensitivityChange = (
		event: {target: {value: number} & EventTarget} & Event & MouseEvent & KeyboardEvent
	) => {
		this.props.store.setLookSensitivity(event.target.value)
	}

	private renderLookSensitivitySetting() {
		const {store} = this.props
		const std = {
			min: 1,
			max: 100,
			value: store.lookSensitivity
		}
		return (
			<div class="setting look-sensitivity">
				<label>Look sensitivity</label>
				<div class="input-wrapper">
					<input
						className="look-sensitivity-range"
						type="range"
						{...std}
						onChange={this.handleLookSensitivityChange}
						onMouseMove={this.handleLookSensitivityChange}
						/>
				</div>
				<div class="input-wrapper">
					<input
						className="look-sensitivity-number"
						type="number"
						{...std}
						onChange={this.handleLookSensitivityChange}
						onKeyDown={this.handleLookSensitivityChange}
						/>
				</div>
			</div>
		)
	}
}

@observer
class Statistics extends Component<{statisticsStore: StatisticsStore}> {
	render() {
		const {statisticsStore} = this.props
		return (
			<div className="stats">
				<div data-stat="logic">
					<label>Logic</label> <output>{statisticsStore.tickRate.toFixed(0)}</output>
				</div>
				<div data-stat="render">
					<label>Render</label> <output>{statisticsStore.renderRate.toFixed(0)}</output>
				</div>
				<div data-stat="timeline">
					<label>Time</label> <output>{(statisticsStore.timeline / 1000).toFixed(2)}</output>
				</div>
			</div>
		)
	}
}
