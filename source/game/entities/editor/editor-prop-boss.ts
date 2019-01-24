
import {Entity} from "../../../core/entity"

interface PropDetails {
	label: string
}

export class EditorPropBoss {
	private props = new Map<typeof Entity, PropDetails>()

	register(
		PropEntityClass: typeof Entity,
		details: PropDetails
	) {
		this.props.set(PropEntityClass, details)
	}
}
