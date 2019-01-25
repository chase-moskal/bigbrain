import * as preact from "preact";
import { MenuStore } from "./menu-store";
import { MenuBarItem } from "./stores-interfaces";
export declare class MenuBarStore {
    menus: MenuBarItem[];
    addMenu(store: MenuStore, Component: typeof preact.Component): void;
    removeMenu(obsolete: MenuStore): void;
    setOpen(store: MenuStore, open?: boolean): void;
}
