var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../babylon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const babylon_1 = require("../../babylon");
    function loadBabylonAssets({ path, scene, onProgress = event => { } }) {
        return __awaiter(this, void 0, void 0, function* () {
            babylon_1.default.SceneLoader.ShowLoadingScreen = false;
            return babylon_1.default.SceneLoader.LoadAssetContainerAsync(path, null, scene, onProgress);
        });
    }
    exports.loadBabylonAssets = loadBabylonAssets;
});
//# sourceMappingURL=load-babylon-assets.js.map