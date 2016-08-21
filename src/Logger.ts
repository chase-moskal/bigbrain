
/**
 * Standard logging unit, just writes to the console.
 * Useful for writing warnings or interesting debug information.
 */
export default class Logger {

  /**
   * Log a message to the console.
   */
  log(...messages: any[]): void {
    console.log.apply(console, messages)
  }

  /**
   * Write a warning to the console.
   */
  warn(...messages: any[]): void {
    console.warn.apply(console, messages)
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

  /**
   * Disabled log function that does nothing.
   */
  warn(...messages: any[]): void {}
}
