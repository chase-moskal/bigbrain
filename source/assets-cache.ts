
import {Entity} from "./entity"

export class AssetsCache {
	private cache = new Map<typeof Entity, any>()

	fetch(EntityClass: typeof Entity, load: () => any): any {
		const {cache} = this
		const cachedAssets = cache.get(EntityClass)

		if (cachedAssets) {
			return cachedAssets
		}
		else {
			const freshAssets = load()
			cache.set(EntityClass, freshAssets)
			return freshAssets
		}
	}
}
