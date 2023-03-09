import { IpcMain, ipcRenderer, IpcRenderer, IpcRendererEvent } from 'electron'
import { FileSelectionResult } from '../file/file-selection-result'
import { VideSettingsModel } from '../settings/vide-settings-model'
import { VideWindowModelUpdateHandler } from '../vide-window/vide-window-model-update-handler'
import { VideWindowModel } from '../vide-window/vide-window-model'
import {
  MODEL_UPDATED,
  REQUEST_OPEN_FILE,
  REQUEST_SETTINGS,
} from './ipc-constants'
import { IpcInterface } from './ipc-interface'

/**
 * Provides functionality of IPC communication for the renderer.
 */
export class IpcRendererInterface implements IpcInterface {
  /**
   * IPC channel
   */
  private ipc: IpcRenderer
  /**
   * Update handler for the model.
   */
  private modelUpdateHandler: VideWindowModelUpdateHandler

  /**
   * IPC exposure for preload.
   */
  public readonly ipcExpose = {
    requestOpenFile: () => this.requestOpenFile(),
    requestSettings: () => this.requestSettings(),
  }

  constructor(
    ipc: IpcRenderer,
    modelUpdateHandler: VideWindowModelUpdateHandler
  ) {
    this.ipc = ipc
    this.modelUpdateHandler = modelUpdateHandler

    this.registerIpc()
  }

  private registerIpc() {
    this.ipc.on(MODEL_UPDATED, (_, data) => {
      const model = data as VideWindowModel
      this.windowModelUpdated(model)
    })
  }

  public async requestOpenFile(): Promise<FileSelectionResult> {
    return (await this.ipc.invoke(REQUEST_OPEN_FILE)) as FileSelectionResult
  }

  public async requestSettings(): Promise<VideSettingsModel> {
    throw (await this.ipc.invoke(REQUEST_SETTINGS)) as VideSettingsModel
  }

  windowModelUpdated(model: VideWindowModel) {
    this.modelUpdateHandler.model = model
  }
}
