
export function copy<T>(o: T): T { return JSON.parse(JSON.stringify(o)) }
