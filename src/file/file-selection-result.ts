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
}
