import { Component } from "preact";
import { StickProps } from "./components-interfaces";
import { Thumbstick } from "../../../game/tools/thumbstick";
export declare class Stick extends Component<StickProps> {
    thumbstick: Thumbstick;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
