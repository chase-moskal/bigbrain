
export const clone = value => JSON.parse(JSON.stringify(value))

export const sleep = (milliseconds: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, milliseconds))

export const environment: "browser" | "node" = new Function("try{return this===window}catch(e){return false}")()
  ? "browser"
  : "node"

export function now() {
  if (environment === "browser") return performance.now()
  else {
    const t = process.hrtime()
    return Math.round((t[0] * 1000) + (t[1] / 1000000))
  }
}

export const identical = (a, b) => JSON.stringify(a) === JSON.stringify(b)
