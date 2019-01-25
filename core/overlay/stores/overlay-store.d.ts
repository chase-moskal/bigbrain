import { StickStore } from "./stick-store";
import { MenuBarStore } from "./menu-bar-store";
import { MainMenuStore } from "./main-menu-store";
import { StatisticsStore } from "./statistics-store";
export declare class OverlayStore {
    readonly menuBar: MenuBarStore;
    readonly mainMenuStore: MainMenuStore;
    readonly stick1: StickStore;
    readonly stick2: StickStore;
    private stickSubscribers;
    readonly sticksEngaged: boolean;
    constructor({ statisticsStore }: {
        statisticsStore: StatisticsStore;
    });
    addStickSubscriber(): void;
    subtractStickSubscriber(): void;
}
