
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {MenuBarProps} from "./components-interfaces.js"

@observer
export class MenuBar extends Component<MenuBarProps> {

	render() {
		const {store: barStore} = this.props
		return (
			<div className="menu-bar">
				{barStore.menus.map(({
					store: menuStore,
					Component: MenuComponent,
					open,
					setOpen
				}) => (
					<div className="menu" data-open={open ? "true" : "false"}>
						<div className="menu-button" onClick={() => setOpen()}>
							{menuStore.label}
						</div>
						{open
							? (
								<div className="menu-panel">
									{<MenuComponent store={menuStore}/>}
								</div>
							)
							: null
						}
					</div>
				))}
			</div>
		)
	}
}
