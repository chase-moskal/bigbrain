
export function assignPropsOntoMap(obj: Object, map: Map<string, any>) {
	Object.keys(obj).forEach(key => map.set(key, obj[key]))
}
