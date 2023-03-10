import { BrowserWindow, dialog, IpcMain, OpenDialogOptions } from 'electron'
import { VideSettings } from '../settings/vide-settings'
import { WindowStateChange } from '../vide-window/window-state-change'
import { WindowStateService } from '../vide-window/window-state-service'
import { ImageFileDetails } from './image-file-details'
import exifr from 'exifr'
import { FileSelectionResult } from './file-selection-result'

/**
 * Service to handle file transactions and selections.
 */
export class FileService {
  /**
   * Settings instance.
   */
  private settings: VideSettings
  /**
   * Window state service instance.
   */
  private windowStateService: WindowStateService

  constructor(settings: VideSettings, windowStateService: WindowStateService) {
    this.settings = settings
    this.windowStateService = windowStateService
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
   * Retrieve the relevant details of a file
   * @param filePath file path to get the details of
   * @returns the file details
   */
  public async requestFileDetails(filePath: string): Promise<ImageFileDetails> {
    const data = await exifr.parse(filePath)

    const details: ImageFileDetails = {}

    const width = data.ImageWidth ?? data.ExifImageWidth ?? null

    if (width) {
      details.dimensions = {
        width: width,
        height: data.ImageHeight ?? data.ExifImageHeight,
      }
    }

    if (data.BitDepth) {
      details.bitDepth = data.BitDepth
    }

    if (data.ColorType) {
      details.colorType = data.ColorType
    }

    if (data.ExposureTime) {
      details.exposureTime = data.ExposureTime
    }

    if (data.FNumber) {
      details.fNumber = data.FNumber
    }

    if (data.ISO) {
      details.iso = data.ISO
    }

    if (data.FocalLength) {
      details.focalLength = data.FocalLength
    }

    if (data.LensModel) {
      details.lens = data.LensModel
    }

    return details
  }

  /**
   * Select a file from the file selector.
   */
  public async requestOpenFile(
    window: BrowserWindow
  ): Promise<FileSelectionResult> {
    this.windowStateService.updateWindowState(
      WindowStateChange.HIDE_WINDOW,
      window
    )

    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(
        this.getOpenDialogOptions
      )

      return {
        wasCancelled: canceled,
        ...(canceled ? {} : { filePath: filePaths[0] }),
      }
    } finally {
      this.windowStateService.updateWindowState(
        WindowStateChange.UN_HIDE_WINDOW,
        window
      )
    }
  }
}
