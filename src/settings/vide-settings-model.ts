/**
 * Defines the user-defined settings that Vide accepts.
 */
export interface VideSettingsModel {
  /**
   * The default launch location of the main Vide window.
   * The location is measured from the center of the window, to the left and top of the monitor, respective to the given x and y values.
   * Units of measurement are in decimal percents of the monitor size.
   * eg: { x: 0.1, y: 0.8 } =
   *    the x value will equal the center of the window, 10% from the left of the monitor
   *    the y value will equal the center of the window, 80% from the top of the monitor
   * |--------------------------------|
   * |                                |
   * |                                |
   * |                                |
   * |  x                             |
   * |--------------------------------|
   */
  defaultWindowLocation: Electron.Point

  /**
   * The default size of the window when no image is present.
   * The size is measured from the left to right, top to bottom
   * Units of measurement are in pixels.
   */
  defaultWindowSize: Electron.Size
  /**
   * The minimum size of the window.
   * The size is measured from the left to right, top to bottom
   * Units of measurement are in pixels.
   */
  minimumWindowSize: Electron.Size
  /**
   * Height of Vide's title-bar in pixels.
   */
  titleBarHeight: number
  /**
   * List of allowed extensions for images.
   */
  imageExtensions: string[]
  /**
   * If to show the default window decorations of your OS.
   */
  showDecorations: boolean
}
