
// mixin decorator
export const mixin = (...sources: Function[]) => (target: Function) => {
  for (const source of sources) {
    for (const name of Object.getOwnPropertyNames(source.prototype))
      target.prototype[name] = source.prototype[name]
  }
}

export interface Service {
  destructor(): void
  start(): void
  stop(): void
}

export class ServiceMaster {
  private services: Service[]
  constructor(services: Service[]) {
    this.services = services
  }
  destructor() {
    for (const service of this.services) service.destructor()
  }
  start() {
    for (const service of this.services) service.start()
  }
  stop() {
    for (const service of this.services) service.stop()
  }
}

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
