import { contextBridge, ipcRenderer } from 'electron'
import { IPC_KEY } from './ipc/ipc-constants'
import { IpcRendererInterface } from './ipc/ipc-renderer-interface'
import { VideWindowModelUpdateHandler } from './vide-window/vide-window-model-update-handler'

const modelUpdateHandler = new VideWindowModelUpdateHandler()
const ipcRendererInterface = new IpcRendererInterface(
  ipcRenderer,
  modelUpdateHandler
)

contextBridge.exposeInMainWorld(IPC_KEY, {
  ...ipcRendererInterface.ipcExpose,
  ...modelUpdateHandler.modelExpose,
})
