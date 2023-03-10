import { BrowserWindow, dialog, IpcMain, OpenDialogOptions } from 'electron'
import { VideSettings } from '../settings/vide-settings'
import { WindowStateChange } from '../vide-window/window-state-change'
import { WindowStateService } from '../vide-window/window-state-service'
import { ImageFileDetails } from './image-file-details'
import exifr from 'exifr'
import { FileSelectionResult } from './file-selection-result'
import fs = require('fs')
import imageSize from 'image-size'
import { promisify } from 'util'

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
   * @param path file path to get the details of
   * @returns the file details
   */
  public async requestFileDetails(path: string): Promise<ImageFileDetails> {
    const details = {
      ...(await this.getImageDetails(path)),
      ...(await this.getFileDetails(path)),
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

      const result: FileSelectionResult = {
        wasCancelled: canceled,
      }

      if (!canceled) {
        const path = filePaths[0]

        result.filePath = path
        result.data = {
          details: {
            ...(await this.getFileDetails(path)),
            ...(await this.getImageDetails(path)),
          },
          fileData: await this.loadImageAsBase64(path),
        }
      }

      return result
    } finally {
      this.windowStateService.updateWindowState(
        WindowStateChange.UN_HIDE_WINDOW,
        window
      )
    }
  }

  private async getFileDetails(path: string): Promise<ImageFileDetails> {
    const p = new Promise<ImageFileDetails>((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) reject(err)

        resolve({
          creationDate: stats.birthtime,
          modifiedDate: stats.mtime,
          size: stats.size,
        })
      })
    })

    return p
  }

  private async getImageDetails(path: string): Promise<ImageFileDetails> {
    const data = await exifr.parse(path)

    const details: ImageFileDetails = await new Promise<ImageFileDetails>(
      (resolve, reject) => {
        imageSize(path, (e, r) => {
          if (e) reject(e)
          else if (!r) reject(`unable to load dimension details for ${path}`)
          else {
            if (r.width == null || r.height == null) {
              reject(`unable to load dimension details for ${path}`)
            } else {
              resolve({
                dimensions: {
                  width: r.width,
                  height: r.height,
                },
              })
            }
          }
        })
      }
    )

    if (data.BitDepth) {
      details.bitDepth = data.BitDepth
    }

    if (data.ColorType) {
      details.colorType = data.ColorType

      if (details.colorType == 'RGB with Alpha') {
        details.colorType = 'RGBA'
      }
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
   * Load image file as a base64 encoded string
   * @param path path of the image.
   * @returns the base64 string
   */
  private async loadImageAsBase64(path: string): Promise<string> {
    if (!path || path.trim().length == 0)
      throw 'loadImageAsBase64() : missing path'

    const pReadFile = promisify(fs.readFile)
    const ext = path.split('.').pop()

    if (!ext || ext.length == 0)
      throw 'loadImageAsBase64() : missing ext on path'

    const bin = await pReadFile(path)
    const base64 = Buffer.from(bin).toString('base64')

    return `data:image/${ext};charset=utf-8;base64,${base64}`
  }
}
