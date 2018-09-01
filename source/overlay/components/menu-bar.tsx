
import {observer} from "mobx-preact"
import {h, Component} from "preact"

import {Menu} from "./menu"
import {MainMenu} from "./main-menu"
import {ContextMenu} from "./context-menu"
import {MenuBarProps} from "./components-interfaces"

import {MenuStore} from "../stores/menu-store"
import {MainMenuStore} from "../stores/main-menu-store"
import {ContextMenuStore} from "../stores/context-menu-store"

export const getDefaultMenuBarProps = (): Partial<MenuBarProps> => ({
	relations: [
		{
			Store: MainMenuStore,
			Component: MainMenu
		},
		{
			Store: ContextMenuStore,
			Component: ContextMenu
		}
	]
})

const defaultMenuBarProps: Partial<MenuBarProps> = getDefaultMenuBarProps()

@observer
export class MenuBar extends Component<MenuBarProps> {

	private getComponentForStore(menuStore: MenuStore): typeof Menu {
		const {relations} = {...defaultMenuBarProps, ...this.props}
		const relation = relations.find(
			({Store}) => menuStore instanceof Store
		)
		if (!relation) throw new Error("unknown menu store class")
		return relation.Component
	}

	render() {
		const {store: barStore} = this.props
		return (
			<div className="menu-bar">
				{barStore.menus.map(({store: menuStore, open, setOpen}) => {
					const MenuComponent = this.getComponentForStore(menuStore)
					return (
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
					)
				})}
			</div>
		)
	}
}
