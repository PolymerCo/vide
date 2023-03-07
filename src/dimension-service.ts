import { BrowserWindow } from 'electron'

/**
 * Service to provide dimensional information and utilities.
 */
export class DimensionService {
  /**
   * Browser window object.
   */
  private window: BrowserWindow

  constructor(window: BrowserWindow) {
    this.window = window
  }
}
