import * as preact from "preact";
import { MenuStore } from "./menu-store";
export interface MenuBarItem {
    store: MenuStore;
    Component: typeof preact.Component;
    open: boolean;
    setOpen: (open?: boolean) => void;
}
export interface MenuStoreOptions {
    label?: string;
    className?: string;
}
