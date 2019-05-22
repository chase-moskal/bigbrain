
import {GenericEntity} from "../entity.js"
import {EntityClasses} from "../interfaces.js"

export const getEntityClass = (type: string, entityClasses: EntityClasses):
typeof GenericEntity => {
	const Class = <typeof GenericEntity><any>entityClasses[type]
	if (!Class) throw new Error(`Unknown entity class "${type}"`)
	return Class
}
