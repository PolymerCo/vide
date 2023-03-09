import { BrowserWindow, Display, Point, Rectangle, screen } from 'electron'

/**
 * Service to provide dimensional information and utilities.
 */
export class DimensionService {
  /**
   * Gets the display that a given BrowserWindow is on.
   * @param window window to get the display of.
   * @return the display.
   */
  public getDisplayForWindow(window: BrowserWindow): Display {
    return (
      screen.getDisplayMatching(window.getBounds()) ??
      screen.getPrimaryDisplay()
    )
  }

  public windowToScreen(point: Point, window: BrowserWindow) {
    return this.windowRectToScreen(point, window.getBounds())
  }

  public windowRectToScreen(point: Point, windowRect: Rectangle) {}

  /**
   * Converts a Point in percent units to an absolute Point.
   * @param point Point in percent units.
   * @returns an absolutely positioned Point.
   */
  public pointPercentToAbsolute(point: Point, window: BrowserWindow): Point {
    const { width, height } = this.getDisplayForWindow(window).bounds

    return {
      x: Math.round(width * point.x),
      y: Math.round(height * point.y),
    }
  }

  /**
   * Converts a Rectangle in percent units to an absolute Rectangle.
   * @param rectangle Rectangle in percent units.
   * @returns an absolutely positioned and sized Rectangle.
   */
  public rectPercentToAbsolute(
    rectangle: Rectangle,
    window: BrowserWindow
  ): Rectangle {
    const { width, height } = this.getDisplayForWindow(window).bounds

    return {
      ...this.pointPercentToAbsolute(
        { x: rectangle.x, y: rectangle.y },
        window
      ),
      width: rectangle.width * width,
      height: rectangle.height * height,
    }
  }
}
