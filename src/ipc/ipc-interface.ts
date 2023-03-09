import { IpcRendererEvent } from 'electron'
import { FileSelectionResult } from '../file/file-selection-result'
import { VideSettingsModel } from '../settings/vide-settings-model'
import { VideWindowModel } from '../vide-window/vide-window-model'

export interface IpcInterface {
  /**
   * Request a file open dialog and return the selection result.
   */
  requestOpenFile(): Promise<FileSelectionResult>
  /**
   * Request the settings for Vide.
   */
  requestSettings(): Promise<VideSettingsModel> | VideSettingsModel
  /**
   * Inform the renderer that the model has updated.
   * @param callback if listening on the client side, callback to run on model update.
   */
  windowModelUpdated(model: VideWindowModel): void
}
