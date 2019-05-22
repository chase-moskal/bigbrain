
import {Input} from "./input.js"

export interface InputKeycodeRelation {
	input: Input
	code: number
}

export interface InputReport {
	input: Input,
	status: boolean
}

export type Bindings = { [alias: string]: Input[] }

export type Status<gBindings extends Bindings = Bindings> = {
	[P in keyof gBindings]: boolean
}

export interface WatcherOptions<gBindings extends Bindings = Bindings> {
	eventTarget?: EventTarget
	bindings: gBindings
}
