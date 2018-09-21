
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {MechanicMenuProps} from "./mechanic-interfaces"

@observer
export class MechanicMenu extends Component<MechanicMenuProps> {

	private handleLoaderInputChange = event => {
		const {value} = event.target
		this.props.store.setLoaderInput(value)
	}

	private handleLoaderButtonClick = () => {
		this.props.store.bogusAddSceneObjects()
	}

	private handleClearAllClick = () => {
		this.props.store.bogusClearAllSceneObjects()
	}

	render() {
		const {store} = this.props
		return (
			<div className="mechanic-menu">
				<div className="loader">
					<input
						type="text"
						placeholder=".babylon url"
						onChange={this.handleLoaderInputChange}/>
					<button onClick={this.handleLoaderButtonClick}>
						load
					</button>
				</div>
				<ul className="scene-object-list">
					{store.sceneObjects.map(sceneObject => {
						const isSelected = (sceneObject === store.selectedObject)
						const handleSelection = () => store.setSelectedObject(sceneObject)
						const handleRemoval = () => store.bogusRemoveSingleSceneObject(sceneObject)
						return (
							<li data-is-selected={isSelected ? "true" : "false"}>
								<p onClick={handleSelection}>{sceneObject.label}</p>
								<button onClick={handleRemoval}>Remove</button>
							</li>
						)
					})}
				</ul>
				<div className="danger-zone">
					<button
						className="clear-all"
						onClick={this.handleClearAllClick}>
							Clear all
					</button>
				</div>
			</div>
		)
	}
}
