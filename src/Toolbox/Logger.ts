
/**
 * Standard logging unit, just writes to the console.
 * Useful for writing warnings or interesting debug information.
 */
export default class Logger {

  /**
   * Log messages to the console.
   */
  log(...messages: any[]): void {
    console.log.apply(console, messages)
  }
}

/**
 * Disabled logger that doesn't do anything with the log messages.
 */
export class DisabledLogger extends Logger {

  /**
   * Disabled log function that does nothing.
   */
  log(...messages: any[]): void {}
}
