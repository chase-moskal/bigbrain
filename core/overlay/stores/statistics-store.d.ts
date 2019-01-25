export declare class StatisticsStore {
    timeline: number;
    slowTickRate: number;
    logicTickRate: number;
    hyperTickRate: number;
    renderFrameRate: number;
    recordTickerStats({ timeline, slowTickRate, logicTickRate, hyperTickRate, renderFrameRate }: {
        timeline: number;
        slowTickRate: number;
        logicTickRate: number;
        hyperTickRate: number;
        renderFrameRate: number;
    }): void;
    recordViewportStats({ renderFrameRate }: {
        renderFrameRate: number;
    }): void;
}
