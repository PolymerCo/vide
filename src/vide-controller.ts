import { App, BrowserWindow, Menu } from 'electron'
import { DimensionService } from './dimension-service'
import { FileService } from './file/file-service'
import { IpcInterface } from './ipc/ipc-interface'
import { IpcMainHandler } from './ipc/ipc-main-handler'
import { VideSettings } from './settings/vide-settings'
import { VideWindowController } from './vide-window/vide-window-controller'
import { WindowStateChange } from './vide-window/window-state-change'
import { WindowStateService } from './vide-window/window-state-service'

export class VideController {
  /**
   * Electron app instance.
   */
  private app: App
  /**
   * Settings for the app.
   */
  private settings: VideSettings
  /**
   * Dimension services.
   */
  private dimensionService?: DimensionService
  /**
   * Window controllers.
   */
  private windowControllers: VideWindowController[] = []
  /**
   * Window state service instance.
   */
  private windowStateService: WindowStateService
  /**
   * IPC handler.
   */
  private ipc: IpcMainHandler

  constructor(
    app: App,
    settings: VideSettings,
    windowStateService: WindowStateService
  ) {
    this.app = app
    this.settings = settings
    this.windowStateService = windowStateService

    this.ipc = new IpcMainHandler(
      new FileService(this.settings, this.windowStateService),
      this.settings,
      windowStateService
    )

    this.setupEvents()
  }

  private setupEvents() {
    this.app.whenReady().then(() => this.onAppReady())
    this.app.on('window-all-closed', () => this.onWindowAllClosed())
    this.app.on('activate', () => {
      BrowserWindow.getAllWindows().forEach(window =>
        this.windowStateService.updateWindowState(
          WindowStateChange.RESTORE_WINDOW,
          window
        )
      )
    })
  }

  /**
   * Create a new window and return the controller.
   * @returns the window controller.
   */
  public newWindow(): VideWindowController {
    const controller = new VideWindowController(
      this.settings,
      new DimensionService(),
      this.ipc
    )

    this.windowControllers.push(controller)
    return controller
  }

  private onAppReady() {
    this.dimensionService = new DimensionService()
    this.newWindow()
  }

  private onWindowAllClosed() {
    this.app.quit()
  }
}
