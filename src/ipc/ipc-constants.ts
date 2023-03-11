import { IpcRendererInterface } from './ipc-renderer-interface'

const IPC_KEY = 'ipc'

declare global {
  interface Window {
    ipc: IpcRendererInterface
  }
}

const REQUEST_OPEN_FILE = 'requestOpenFile'
const REQUEST_SETTINGS = 'requestSettings'
const REQUEST_WINDOW_STATE_CHANGE = 'requestWindowStateChange'
const MAXIMIZED_STATUS_CHANGED = 'fullScreenStatusChanged'
const REQUEST_FILE_DETAILS = 'requestFileDetails'
const REQUEST_PLATFORM = 'requestPlatform'

export {
  IPC_KEY,
  REQUEST_OPEN_FILE,
  REQUEST_SETTINGS,
  REQUEST_WINDOW_STATE_CHANGE,
  MAXIMIZED_STATUS_CHANGED,
  REQUEST_FILE_DETAILS,
  REQUEST_PLATFORM,
}
