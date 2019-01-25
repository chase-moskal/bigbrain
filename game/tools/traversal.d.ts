import babylon from "../../babylon";
import { Input } from "../../core/watcher/input";
import { ThumbstickInfo, MovementInputs, MovableNode } from "./tools-interfaces";
export declare const traversiveBindings: {
    forward: Input[];
    backward: Input[];
    left: Input[];
    right: Input[];
    raise: Input[];
    lower: Input[];
    sprint: Input[];
};
export declare function ascertainMovement({ watcher, stickInfo, maxSpeed, timeFactor, sprintFactor }: MovementInputs): babylon.Vector3;
export declare function enactMovement({ node, move }: {
    node: MovableNode;
    move: babylon.Vector3;
}): void;
export declare function ascertainLook(params: {
    event: MouseEvent;
    stickInfo: ThumbstickInfo;
}): babylon.Quaternion;
