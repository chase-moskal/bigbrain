import babylon from "../../babylon";
import { Bearings } from "../../core/interfaces";
export declare const makeCamera: ({ scene, bearings, speed }: {
    scene: babylon.Scene;
    bearings: Bearings;
    speed: number;
}) => babylon.FreeCamera;
export declare function makeBasicCamera({ scene, bearings }: {
    scene: babylon.Scene;
    bearings: Bearings;
}): babylon.TargetCamera;
export declare const makeActiveCamera: ({ scene, position, speed }: {
    scene: babylon.Scene;
    position: [number, number, number];
    speed: number;
}) => babylon.FreeCamera;
