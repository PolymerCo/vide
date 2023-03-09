import { IpcInterface } from './ipc-interface'

const IPC_KEY: string = 'ipc'

declare global {
  interface Window {
    ipc: IpcInterface
  }
}

const REQUEST_OPEN_FILE: string = 'requestOpenFile'
const REQUEST_SETTINGS: string = 'requestSettings'
const WINDOW_MODEL_UPDATED: string = 'windowModelUpdated'

export {
  IPC_KEY,
  REQUEST_OPEN_FILE,
  REQUEST_SETTINGS,
  WINDOW_MODEL_UPDATED as MODEL_UPDATED,
}
