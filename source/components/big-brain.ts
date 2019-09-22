
import {LitElement, property, html} from "lit-element"

export class BigBrain extends LitElement {
	@property({type: Boolean, reflect: true}) active: boolean = false

	render() {
		return html`
			<p>bigbrain is deep in thought</p>
		`
	}
}
