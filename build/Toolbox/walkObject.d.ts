/**
 * Run an action function on the given object, each of its properties, and recurse through each object.
 */
export default function walkObject(subject: Object, action: (value: any) => void): void;
