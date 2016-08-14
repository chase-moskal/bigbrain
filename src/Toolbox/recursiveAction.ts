
/**
 * Take action on an object and all of its set properties.
 */
export default function recursiveAction(subject: any, action: (value: any) => void) {

  action(subject)

  for (const key of Object.keys(subject)) {
    const value = subject[key]
    recursiveAction(value, action)
  }
}
