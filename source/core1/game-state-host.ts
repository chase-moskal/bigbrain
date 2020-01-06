
import {GameState} from "./game-state.js"
import {StateHost} from "../interfaces.js"

export class GameStateHost extends GameState implements StateHost {

	insert(entry: any): void {}

	extract(id: string): void {}
}
