import { App, BrowserWindow, ipcMain, Point, screen } from 'electron'
import { DimensionService } from '../dimension-service'
import { INDEX_HTML_PATH, PRELOAD_PATH } from '../file-paths'
import { FileService } from '../file/file-service'
import { IpcMainHandler } from '../ipc/ipc-main-handler'
import { VideSettings } from '../settings/vide-settings'

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
  private settings?: VideSettings
  /**
   * Dimension service.
   */
  private dimensionService?: DimensionService
  /**
   * File service.
   */
  private fileService?: FileService
  /**
   * Window of the app.
   */
  private window?: BrowserWindow
  /**
   * IPC handler.
   */
  private ipcMainHandler?: IpcMainHandler

  constructor(app: App) {
    this.app = app
    this.app.whenReady().then(this.onAppReady.bind(this))
    this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))
  }

  /**
   * Centers a given window at a given point.
   * @param point point to center on.
   * @param window window to center.
   */
  public static centerWindowAt(point: Point, window: BrowserWindow) {
    if (!window) return

    const currentBounds = window.getBounds()

    window.setBounds({
      x: Math.round(point.x - currentBounds.width / 2),
      y: Math.round(point.y - currentBounds.height / 2),
    })
  }

  /**
   * Runs once when the application is in a ready state.
   */
  private onAppReady() {
    this.settings = new VideSettings()
    this.dimensionService = new DimensionService()
    this.fileService = new FileService(this.settings)

    this.window = this.createWindow(this.settings)

    this.ipcMainHandler = new IpcMainHandler(
      ipcMain,
      this.fileService,
      this.settings,
      this.window
    )
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') this.app.quit()
  }

  private createWindow(settings: VideSettings): BrowserWindow {
    const w = new BrowserWindow({
      frame: false,
      webPreferences: {
        preload: PRELOAD_PATH,
        sandbox: false,
      },
      roundedCorners: false,
    })

    var size = settings.get().defaultWindowSize
    var position = settings.get().defaultWindowLocation

    position =
      this.dimensionService?.pointPercentToAbsolute(position, w) ?? position

    w.webContents.openDevTools({
      mode: 'undocked',
    })

    w.setBounds({
      width: size.x,
      height: size.y,
    })

    VideWindowController.centerWindowAt(position, w)

    w.loadFile(INDEX_HTML_PATH)
    w.show()

    return w
  }
}
