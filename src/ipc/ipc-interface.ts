import { BrowserWindow, IpcRendererEvent } from 'electron'
import { ImageFileDetails } from '../file/image-file-details'
import { FileSelectionResult } from '../file/file-selection-result'
import { VideSettingsModel } from '../settings/vide-settings-model'
import { VideWindowModel } from '../vide-window/vide-window-model'
import { WindowStateChange } from '../vide-window/window-state-change'

export interface IpcInterface {
  /**
   * Request a file open dialog and return the selection result.
   */
  requestOpenFile(window?: BrowserWindow): Promise<FileSelectionResult>
  /**
   * Request the settings for Vide.
   */
  requestSettings(): Promise<VideSettingsModel> | VideSettingsModel
  /**
   * Request that the current window state is changed to match the provided state options.
   * @param state state option flags.
   */
  requestWindowStateChange(
    state: WindowStateChange,
    window?: BrowserWindow
  ): void

  /**
   * Notify that the fullscreen status of the application has changed.
   */
  maximizedStatusChanged(
    state?:
      | {
          maximizedStatus: boolean
          window: BrowserWindow
        }
      | ((state: boolean) => void)
  ): void
  /**
   * Request details of a specified file.
   * @param path path of file to get the details of.
   */
  requestFileDetails(path: string): Promise<ImageFileDetails> | ImageFileDetails
  /**
   * Request string that identifies the current platform
   */
  requestPlatform(): Promise<NodeJS.Platform> | NodeJS.Platform
}
