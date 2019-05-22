
// mixin decorator
export const mixin = (...sources: Function[]) => (target: Function) => {
	for (const source of sources) {
		for (const name of Object.getOwnPropertyNames(source.prototype))
			target.prototype[name] = source.prototype[name]
	}
}
