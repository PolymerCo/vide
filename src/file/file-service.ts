import { dialog, IpcMain, OpenDialogOptions } from 'electron'
import { VideSettings } from '../settings/vide-settings'
import { FileSelectionResult } from './file-selection-result'

/**
 * Service to handle file transactions and selections.
 */
export class FileService {
  /**
   * Settings instance.
   */
  private settings: VideSettings

  constructor(settings: VideSettings) {
    this.settings = settings
  }

  /**
   * Get the options for the open file dialog.
   */
  private get getOpenDialogOptions(): OpenDialogOptions {
    return {
      properties: ['openFile'],
      filters: [
        {
          name: 'Images',
          extensions: this.settings.get().imageExtensions,
        },
      ],
    }
  }

  /**
   * Select a file from the file selector.
   */
  public async requestOpenFile(): Promise<FileSelectionResult> {
    console.log(this.getOpenDialogOptions)
    const { canceled, filePaths } = await dialog.showOpenDialog(
      this.getOpenDialogOptions
    )

    return {
      wasCancelled: canceled,
      ...(canceled ? {} : { filePath: filePaths[0] }),
    }
  }
}
