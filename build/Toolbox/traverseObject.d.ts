/**
 * Traverse a JavaScript object with a dot-notation string (or string array).
 */
export default function traverseObject<T>(object: Object, routeInput: string | string[]): T;
