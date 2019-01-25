import babylon from "../../babylon";
export declare function loadBabylonAssets({ path, scene, onProgress }: {
    path: string;
    scene: babylon.Scene;
    onProgress: (event: babylon.SceneLoaderProgressEvent) => void;
}): Promise<babylon.AssetContainer>;
