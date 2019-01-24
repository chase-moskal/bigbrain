
import babylon from "../../babylon"

export function getVectorMagnitude(vector: babylon.Vector3): number {
	return Math.sqrt((vector.x ** 2) + (vector.y ** 2) + (vector.z ** 2))
}
