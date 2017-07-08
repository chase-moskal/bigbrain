
/**
 * Run an action function on the given object, each of its properties, and recurse through each object.
 */
export default function walkObject(subject: Object, action: (value: any) => void) {

  action(subject)

  if (subject instanceof Object) {
    for (const key of Object.keys(subject)) {
      const value = subject[key]
      walkObject(value, action)
    }
  }
}
