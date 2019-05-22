
/**
 * clone an object structure's enumerable own properties
 */
export function copyDeep<T extends any = any>(input: T): T {
	if (!input) return input

	else if (Array.isArray(input)) {
		const output: any[] = []
		for (const item of <any[]>input)
			output.push(copyDeep(item))
		return <T><any>output
	}

	else if (typeof input !== "object") {
		const output: any = {}
		for (const key of Object.keys(input))
			output[key] = copyDeep(input[key])
		return output
	}

	else throw new Error(`unknown copy-deep error`)
}
