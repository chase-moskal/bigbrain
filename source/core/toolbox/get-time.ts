
import {environment} from "./environment.js"

declare const process: any

/**
 * Current time in milliseconds
 * - counts elapsed browser session time
 */
export function getTime(): number {
	if (environment === "browser") return performance.now()
	else {
		const t = process.hrtime()
		return Math.round((t[0] * 1000) + (t[1] / 1000000))
	}
}
