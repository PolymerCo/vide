import { BrowserWindow, IpcRenderer, IpcRendererEvent } from 'electron'
import { FileSelectionResult } from '../file/file-selection-result'
import { VideSettingsModel } from '../settings/vide-settings-model'
import { VideWindowModel } from '../vide-window/vide-window-model'
import {
  MAXIMIZED_STATUS_CHANGED,
  REQUEST_FILE_DETAILS,
  REQUEST_OPEN_FILE,
  REQUEST_SETTINGS,
  REQUEST_WINDOW_STATE_CHANGE,
  REQUEST_PLATFORM,
} from './ipc-constants'
import { IpcInterface } from './ipc-interface'
import { WindowStateChange } from '../vide-window/window-state-change'
import { ImageFileDetails } from '../file/image-file-details'

/**
 * Provides functionality of IPC communication for the renderer.
 */
export class IpcRendererInterface implements IpcInterface {
  /**
   * IPC channel
   */
  private ipc: IpcRenderer
  /**
   * Observers that are observing a fullscreen status change.
   */
  private onMaximizedStatusChangedObservers: ((state: boolean) => void)[] = []

  /**
   * IPC exposure for preload.
   */
  public readonly ipcExpose = {
    requestOpenFile: () => this.requestOpenFile(),
    requestSettings: () => this.requestSettings(),
    requestWindowStateChange: (state: WindowStateChange) =>
      this.requestWindowStateChange(state),
    maximizedStatusChanged: (callback: (state: boolean) => void) =>
      this.maximizedStatusChanged(callback),
    requestFileDetails: (path: string) => this.requestFileDetails(path),
    requestPlatform: () => this.requestPlatform(),
  }

  constructor(ipc: IpcRenderer) {
    this.ipc = ipc

    this.setupIpc()
  }

  private setupIpc() {
    this.ipc.on(
      MAXIMIZED_STATUS_CHANGED,
      (_: IpcRendererEvent, state: boolean) => {
        this.onMaximizedStatusChangedObservers.forEach(observer =>
          observer(state)
        )
      }
    )
  }

  public async requestOpenFile(): Promise<FileSelectionResult> {
    return this.ipc.invoke(REQUEST_OPEN_FILE)
  }

  public requestSettings(): Promise<VideSettingsModel> {
    return this.ipc.invoke(REQUEST_SETTINGS)
  }

  public requestWindowStateChange(state: WindowStateChange): void {
    this.ipc.invoke(REQUEST_WINDOW_STATE_CHANGE, state)
  }

  public maximizedStatusChanged(callback: (state: boolean) => void): void {
    this.onMaximizedStatusChangedObservers.push(callback)
  }

  public requestFileDetails(path: string): Promise<ImageFileDetails> {
    return this.ipc.invoke(REQUEST_FILE_DETAILS, path)
  }

  public requestPlatform(): Promise<NodeJS.Platform> {
    return this.ipc.invoke(REQUEST_PLATFORM)
  }
}
