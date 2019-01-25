import { ThumbstickInfo } from "../../../game/tools/tools-interfaces";
export declare class StickStore implements ThumbstickInfo {
    angle: number;
    force: number;
    active: boolean;
    setInfo({ angle, force }: ThumbstickInfo): void;
    setActive(active: boolean): void;
}
