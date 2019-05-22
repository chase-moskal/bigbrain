
/**
 * freeze an object in-place
 */
export function freezie<T = any>(target: T): T {
	Object.freeze(target)

	if (typeof target === "object" || typeof target === "function")
		for (const key of Object.getOwnPropertyNames(target))
			freezie(target[key])

	return target
}
