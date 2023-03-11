import { contextBridge, ipcRenderer } from 'electron'
import { IPC_KEY } from './ipc/ipc-constants'
import { IpcRendererInterface } from './ipc/ipc-renderer-interface'
import { TimeUtil } from './time-util'

const ipcRendererInterface = new IpcRendererInterface(ipcRenderer)

contextBridge.exposeInMainWorld(IPC_KEY, {
  ...ipcRendererInterface.ipcExpose,
})

contextBridge.exposeInMainWorld('timeUtil', {
  secondsToReadableTime: (seconds: number) =>
    TimeUtil.secondsToReadableTime(seconds),
})
