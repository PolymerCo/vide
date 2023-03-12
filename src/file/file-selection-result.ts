import { ImageFile } from './image-file'
import { ImageFileDetails } from './image-file-details'

/**
 * Result of a file selection operation.
 */
export interface FileSelectionResult {
  /**
   * If the file selection was cancelled.
   */
  wasCancelled: boolean
  /**
   * Path of the file selected.
   */
  filePath?: string
  /**
   * Data associated with the file.
   */
  data?: ImageFile
}
