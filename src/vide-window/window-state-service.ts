import { BrowserWindow } from 'electron'
import { WindowStateChange } from './window-state-change'

export class WindowStateService {
  public updateWindowState(request: WindowStateChange, window: BrowserWindow) {
    if ((request & WindowStateChange.CLOSE_WINDOW) != 0) {
      window.close()
    }

    if ((request & WindowStateChange.MINIMIZE_WINDOW) != 0) {
      window.minimize()
    }

    if ((request & WindowStateChange.RESTORE_WINDOW) != 0) {
      window.restore()
    }

    if ((request & WindowStateChange.MAXIMIZE_WINDOW) != 0) {
      window.maximize()
    }

    if ((request & WindowStateChange.UN_MAXIMIZE_WINDOW) != 0) {
      window.unmaximize()
    }

    if ((request & WindowStateChange.HIDE_WINDOW) != 0) {
      window.hide()
    }

    if ((request & WindowStateChange.UN_HIDE_WINDOW) != 0) {
      window.show()
    }
  }
}
