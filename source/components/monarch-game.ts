
import {LitElement, property, html} from "lit-element"

export class MonarchGame extends LitElement {
	@property({type: Boolean, reflect: true}) active: boolean = false

	render() {
		return html`
			<p>monarch game coming soon</p>
		`
	}
}
