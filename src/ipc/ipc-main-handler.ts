import { BrowserWindow, IpcMain } from 'electron'
import { FileSelectionResult } from '../file/file-selection-result'
import { FileService } from '../file/file-service'
import { VideSettings } from '../settings/vide-settings'
import { VideSettingsModel } from '../settings/vide-settings-model'
import { VideWindowModel } from '../vide-window/vide-window-model'
import {
  MODEL_UPDATED,
  REQUEST_OPEN_FILE,
  REQUEST_SETTINGS,
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

  private readonly window: BrowserWindow

  constructor(
    ipc: IpcMain,
    fileService: FileService,
    settings: VideSettings,
    window: BrowserWindow
  ) {
    this.ipc = ipc
    this.fileService = fileService
    this.settings = settings
    this.window = window

    this.registerIpc()
  }

  private registerIpc() {
    this.ipc.handle(REQUEST_OPEN_FILE, this.requestOpenFile.bind(this))
    this.ipc.handle(REQUEST_SETTINGS, this.requestSettings.bind(this))
  }

  requestOpenFile(): Promise<FileSelectionResult> {
    return this.fileService.requestOpenFile()
  }

  requestSettings(): VideSettingsModel {
    return this.settings.get()
  }

  windowModelUpdated(model: VideWindowModel) {
    this.window.webContents.send(MODEL_UPDATED, model)
  }
}
