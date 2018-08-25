
export function pathBreakdown(path: string) {
	let dirpath = ""
	let filename = ""
	if (path.includes("/")) {
		const parts = path.split("/")
		filename = parts.pop()
		dirpath = parts.join("/") + "/"
	} else {
		filename = path
	}
	return {dirpath, filename}
}
