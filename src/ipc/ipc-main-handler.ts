import { ipcMain, IpcMain, IpcMainInvokeEvent, WebContents } from 'electron'
import { BrowserWindow } from 'electron/main'
import { ImageFileDetails } from '../file/image-file-details'
import { FileSelectionResult } from '../file/file-selection-result'
import { FileService } from '../file/file-service'
import { VideSettings } from '../settings/vide-settings'
import { VideSettingsModel } from '../settings/vide-settings-model'
import { WindowStateChange } from '../vide-window/window-state-change'
import { WindowStateService } from '../vide-window/window-state-service'
import {
  MAXIMIZED_STATUS_CHANGED,
  REQUEST_FILE_DETAILS,
  REQUEST_OPEN_FILE,
  REQUEST_PLATFORM,
  REQUEST_SETTINGS,
  REQUEST_WINDOW_STATE_CHANGE,
} from './ipc-constants'
import { IpcInterface } from './ipc-interface'

export class IpcMainHandler implements IpcInterface {
  /**
   * IPC handler.
   */
  private readonly ipc: IpcMain
  /**
   * File service.
   */
  private readonly fileService: FileService
  /**
   * Settings for Vide.
   */
  private readonly settings: VideSettings
  /**
   * Window state service.
   */
  private readonly windowStateService: WindowStateService

  constructor(
    fileService: FileService,
    settings: VideSettings,
    windowStateService: WindowStateService
  ) {
    this.ipc = ipcMain
    this.fileService = fileService
    this.settings = settings
    this.windowStateService = windowStateService

    this.registerIpc()
  }

  private registerIpc() {
    this.ipc.handle(REQUEST_OPEN_FILE, (request: IpcMainInvokeEvent) =>
      this.requestOpenFile(this.getSenderBrowserWindow(request.sender))
    )
    this.ipc.handle(REQUEST_SETTINGS, () => this.requestSettings())
    this.ipc.handle(
      REQUEST_WINDOW_STATE_CHANGE,
      (request: IpcMainInvokeEvent, state: WindowStateChange) => {
        this.requestWindowStateChange(
          state,
          this.getSenderBrowserWindow(request.sender)
        )
      }
    )
    this.ipc.handle(
      REQUEST_FILE_DETAILS,
      (_: IpcMainInvokeEvent, path: string) => {
        return this.requestFileDetails(path)
      }
    )
    this.ipc.handle(REQUEST_PLATFORM, () => this.requestPlatform())
  }

  public requestOpenFile(window: BrowserWindow): Promise<FileSelectionResult> {
    return this.fileService.requestOpenFile(window)
  }

  public requestSettings(): VideSettingsModel {
    return this.settings.get()
  }

  public requestWindowStateChange(
    state: WindowStateChange,
    window: BrowserWindow
  ): void {
    this.windowStateService.updateWindowState(state, window)
  }

  public maximizedStatusChanged(state: {
    maximizedStatus: boolean
    window: BrowserWindow
  }): void {
    state.window.webContents.send(
      MAXIMIZED_STATUS_CHANGED,
      state.maximizedStatus
    )
  }

  public requestFileDetails(path: string): Promise<ImageFileDetails> {
    return this.fileService.requestFileDetails(path)
  }

  public requestPlatform(): NodeJS.Platform {
    return process.platform
  }

  /**
   * Gets the BrowserWindow from a given WebContents sender.
   * @param sender the sender to get the window of.
   * @throws if there is no BrowserWindow associated with the sender.
   */
  private getSenderBrowserWindow(sender: WebContents): BrowserWindow {
    const window = BrowserWindow.fromWebContents(sender)

    if (!window)
      throw `getSenderBrowserWindow() : detached WebContents ${sender.id}`

    return window
  }
}
