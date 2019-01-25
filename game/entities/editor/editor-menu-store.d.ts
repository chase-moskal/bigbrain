import { MenuStore } from "../../../core/overlay/stores/menu-store";
import { EditorTool } from "./editor-interfaces";
export declare class AdditionTool implements EditorTool {
    label: string;
    tooltip: string;
}
export declare class SelectionTool implements EditorTool {
    label: string;
    tooltip: string;
}
export declare class EditorMenuStore extends MenuStore {
    label: string;
    activeTool: EditorTool;
    tools: EditorTool[];
    setActiveTool(tool: EditorTool): void;
}
