import { readFile } from 'fs'
import { promisify } from 'util'

declare global {
  interface Window {
    dataUtil: {
      bytesToReadableSize(bytes: number): string
    }
  }
}

/**
 * Utilities for working with data
 */
export class DataUtil {
  /**
   * Converts a seconds input into a readable time string.
   * @param bytes number of bytes.
   */
  public static bytesToReadableSize(bytes: number): string {
    const pivot = 500
    let v: number
    let u: string

    if (bytes < pivot) {
      v = bytes
      u = 'b'
    } else if (bytes < pivot * 1000) {
      v = bytes / 1000
      u = 'kb'
    } else if (bytes < pivot * 1000000) {
      v = bytes / 1000000
      u = 'MB'
    } else if (bytes < pivot * 1000000000) {
      v = bytes / 1000000000
      u = 'GB'
    } else {
      v = bytes / 1000000000000
      u = 'TB'
    }

    v = Math.round((v + Number.EPSILON) * 100) / 100
    return `${v}${u}`
  }
}
