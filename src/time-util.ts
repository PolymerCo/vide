declare global {
  interface Window {
    timeUtil: {
      secondsToReadableTime(seconds: number): string
    }
  }
}

/**
 * Utilities for time
 */
export class TimeUtil {
  /**
   * Converts a seconds input into a readable time string.
   * @param seconds seconds input.
   */
  public static secondsToReadableTime(seconds: number): string {
    let v: number
    let u: string

    if (seconds < 0.0000001) {
      v = seconds * 1000000000
      u = 'ns'
    } else if (seconds < 0.0001) {
      v = seconds * 1000000
      u = 'µs'
    } else if (seconds < 0.1) {
      v = seconds * 1000
      u = 'ms'
    } else if (seconds < 60) {
      v = seconds
      u = 's'
    } else if (seconds < 3600) {
      v = seconds / 60
      u = 'm'
    } else if (seconds < 86400) {
      v = seconds / 3600
      u = 'h'
    } else {
      v = seconds / 86400
      u = 'd'
    }

    v = Math.round((v + Number.EPSILON) * 100) / 100
    return `${v}${u}`
  }
}
