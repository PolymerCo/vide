import { BrowserWindow, Point, Size } from 'electron'
import { DimensionService } from '../dimension-service'
import { INDEX_HTML_PATH, PRELOAD_PATH } from '../file-paths'
import { IpcMainHandler } from '../ipc/ipc-main-handler'
import { VideSettings } from '../settings/vide-settings'

/**
 * Controls the state of the electron window.
 */
export class VideWindowController {
  /**
   * Dimension service.
   */
  private dimensionService: DimensionService
  /**
   * Settings instance.
   */
  private settings: VideSettings
  /**
   * IPC handler instance.
   */
  private ipc: IpcMainHandler

  /**
   * Window of the app.
   */
  private window?: BrowserWindow

  constructor(
    settings: VideSettings,
    dimensionService: DimensionService,
    ipc: IpcMainHandler
  ) {
    this.settings = settings
    this.dimensionService = dimensionService
    this.ipc = ipc

    this.createWindow()
  }

  /**
   * Centers a given window at a given point.
   * @param point point to center on.
   * @param window window to center.
   */
  public centerWindowAt(point: Point, window: BrowserWindow) {
    if (!window) return

    const currentBounds = window.getBounds()

    window.setBounds({
      x: Math.round(point.x - currentBounds.width / 2),
      y: Math.round(point.y - currentBounds.height / 2),
    })
  }

  /**
   * Sets the dimensions of a given window.
   * @param dimensions new dimensions of the window.
   * @param window window object to modify.
   * @param includeBars if the title and tool bars should be added to the final dimensions.
   */
  public sizeWindow(
    dimensions: Size,
    window: BrowserWindow,
    includeBars: boolean = true
  ) {
    if (!window) return

    window.setBounds({
      width: dimensions.width,
      height:
        dimensions.height +
        (this.settings && includeBars
          ? this.settings.get().titleBarHeight +
            this.settings.get().statusBarHeight
          : 0),
    })
  }

  private createWindow(): BrowserWindow {
    const w = new BrowserWindow({
      frame: this.settings.get().showDecorations,
      webPreferences: {
        preload: PRELOAD_PATH,
        sandbox: false,
      },
      roundedCorners: false,
    })

    var size = this.settings.get().defaultWindowSize
    var position = this.settings.get().defaultWindowLocation

    position =
      this.dimensionService?.pointPercentToAbsolute(position, w) ?? position

    w.webContents.openDevTools({
      mode: 'undocked',
    })

    const minSize = this.settings.get().minimumWindowSize
    w.setMinimumSize(minSize.width, minSize.height)

    this.sizeWindow(size, w, false)
    this.centerWindowAt(position, w)

    this.setupWindowListeners(w)

    w.loadFile(INDEX_HTML_PATH)
    w.show()

    return w
  }

  private setupWindowListeners(window: BrowserWindow) {
    const notifyMaximized = () =>
      this.ipc.maximizedStatusChanged({
        maximizedStatus: true,
        window: window,
      })

    const notifyNotMaximized = () =>
      this.ipc.maximizedStatusChanged({
        maximizedStatus: false,
        window: window,
      })

    window.on('maximize', () => {
      notifyMaximized()
    })

    window.on('resized', () => {
      notifyNotMaximized()
    })

    window.on('move', () => {
      notifyNotMaximized()
    })

    window.on('unmaximize', () => {
      notifyNotMaximized()
    })
  }
}
