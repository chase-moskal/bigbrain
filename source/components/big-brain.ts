
import {LitElement, property, html, css} from "lit-element"

import {createViewport} from "../core/viewport.js"

export class BigBrain extends LitElement {

	@property({type: Object})
		private _viewport = createViewport()

	static get styles() {return css`
		canvas {
			background: red;
		}
	`}

	render() {
		const {_viewport} = this
		return _viewport ? html`
			<p>canvas!</p>
			${_viewport.canvas}
		` : html`
			<p>bigbrain is deep in thought</p>
		`
	}
}
