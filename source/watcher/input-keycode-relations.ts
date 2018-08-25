
import {Input} from "./input"
import {InputKeycodeRelation} from "./watcher-interfaces"

export const inputKeycodeRelations: InputKeycodeRelation[] = [
	{input: Input.W, code: 87},
	{input: Input.A, code: 65},
	{input: Input.S, code: 83},
	{input: Input.D, code: 68},

	{input: Input.Q, code: 81},
	{input: Input.E, code: 69},
	{input: Input.Z, code: 90},
	{input: Input.X, code: 88},
	{input: Input.C, code: 67},

	{input: Input.R, code: 82},
	{input: Input.F, code: 70},
	{input: Input.V, code: 86},

	{input: Input.Shift, code: 16},
	{input: Input.Ctrl,  code: 17},
	{input: Input.Alt,   code: 18},
	{input: Input.Space, code: 32},

	{input: Input.ArrowLeft,  code: 37},
	{input: Input.ArrowUp,    code: 38},
	{input: Input.ArrowRight, code: 39},
	{input: Input.ArrowDown,  code: 40},

	{input: Input.One,   code: 49},
	{input: Input.Two,   code: 50},
	{input: Input.Three, code: 51},
	{input: Input.Four,  code: 52},
	{input: Input.Five,  code: 53},
	{input: Input.Six,   code: 54},
	{input: Input.Seven, code: 55},
	{input: Input.Eight, code: 56},
	{input: Input.Nine,  code: 57},
	{input: Input.Zero,  code: 48},

	{input: Input.Backspace, code: 8},
	{input: Input.Delete, code: 46}
]
