
export const environment: "browser" | "node" = new Function(
	"try{return this===window}catch(e){return false}")()
		? "browser"
		: "node"
