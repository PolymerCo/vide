/**
 * Details of a given image file
 */
export interface ImageFileDetails {
  /**
   * Dimensions of the image, if found.
   */
  dimensions?: {
    /**
     * Width of the image in pixels.
     */
    width: number
    /**
     * Height of the image in pixels.
     */
    height: number
  }
  /**
   * Bit-depth of the image
   */
  bitDepth?: number
  /**
   * Color type of the image
   */
  colorType?: string
  /**
   * Exposure time (camera)
   */
  exposureTime?: number
  /**
   * F number (camera)
   */
  fNumber?: number
  /**
   * ISO value (camera)
   */
  iso?: number
  /**
   * Focal length (camera)
   */
  focalLength?: number
  /**
   * Lens model (camera)
   */
  lens?: string
}
