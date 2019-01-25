import { MenuStore } from "./menu-store";
import { StatisticsStore } from "./statistics-store";
export declare class MainMenuStore extends MenuStore {
    label: string;
    lookSensitivity: number;
    statisticsStore: StatisticsStore;
    constructor({ statisticsStore }: {
        statisticsStore: StatisticsStore;
    });
    setLookSensitivity(value: number): void;
}
