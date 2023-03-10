/**
 * The window state changes that can be requested.
 */
export const enum WindowStateChange {
  /**
   * Request to close the window.
   */
  CLOSE_WINDOW = 1 << 0,
  /**
   * Request to minimize the window.
   */
  MINIMIZE_WINDOW = 1 << 1,
  /**
   * Request to restore (un-minimize) window.
   */
  RESTORE_WINDOW = 1 << 2,
  /**
   * Request to maximize the window.
   */
  MAXIMIZE_WINDOW = 1 << 3,
  /**
   * Request to un-maximize the window.
   */
  UN_MAXIMIZE_WINDOW = 1 << 4,
  /**
   * Hides the window from view.
   */
  HIDE_WINDOW = 1 << 5,
  /**
   * Un-hides the window from view.
   */
  UN_HIDE_WINDOW = 1 << 6,
}
