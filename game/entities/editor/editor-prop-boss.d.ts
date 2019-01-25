import { Entity } from "../../../core/entity";
interface PropDetails {
    label: string;
}
export declare class EditorPropBoss {
    private props;
    register(PropEntityClass: typeof Entity, details: PropDetails): void;
}
export {};
