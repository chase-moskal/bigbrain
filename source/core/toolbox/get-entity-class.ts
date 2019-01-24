
import {GenericEntity} from "../entity"
import {EntityClasses} from "../interfaces"

export const getEntityClass = (type: string, entityClasses: EntityClasses):
typeof GenericEntity => {
	const Class = <typeof GenericEntity><any>entityClasses[type]
	if (!Class) throw new Error(`Unknown entity class "${type}"`)
	return Class
}
