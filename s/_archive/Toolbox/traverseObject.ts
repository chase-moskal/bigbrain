
/**
 * Traverse a JavaScript object with a dot-notation string (or string array).
 */
export default function traverseObject<T>(object: Object, routeInput: string | string[]): T {

  // Convert dot-notation route input into a simple array of strings.
  const route: string[] = (typeof routeInput === 'string')
    ? routeInput.split('.')
    : routeInput

  // Route cannot be empty.
  if (!route.length) throw `Cannot traverse object with empty route.`

  // Take one route step forward.
  const routeStep = route.shift() // Take the next route step.
  const subject = object[routeStep] // Obtain the subject, the value of the property identified by this route step.

  // If this is the final route step, return the subject.
  if (!route.length) {
    return <T>subject
  }

  // There is more routing to do. Recurse.
  else {

    // All but the final traversal must be through objects (the middle of your route cannot be a primitive value).
    if (typeof subject !== 'object') throw `Subject is not a traversable object. routeStep=${routeStep}, route=[${route.join(',')}].`

    // Return the recursive result.
    return traverseObject<T>(subject, route)
  }
}
