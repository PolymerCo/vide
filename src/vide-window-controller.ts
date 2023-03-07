import { App, BrowserWindow } from 'electron'
import { VideSettings } from './settings/vide-settings'

/**
 * Controls the state of the electron window.
 */
export class VideWindowController {
  /**
   * Electron app instance.
   */
  private app: App

  /**
   * Settings for the app.
   */
  private settings: VideSettings

  /**
   * Window of the app.
   */
  private window: BrowserWindow

  constructor(app: App, settings: VideSettings) {
    this.app = app
    this.settings = settings

    this.app.whenReady().then(this.onAppReady)
  }

  /**
   * Runs once when the application is in a ready state.
   */
  private onAppReady() {}
}
