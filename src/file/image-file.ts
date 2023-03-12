import { ImageFileDetails } from './image-file-details'

export interface ImageFile {
  /**
   * Image file data.
   */
  fileData: string
  /**
   * File meta details.
   */
  details: ImageFileDetails
}
