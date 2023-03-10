import { ImageFileDetails } from './file/image-file-details'
import { VideSettingsModel } from './settings/vide-settings-model'
import { WindowStateChange } from './vide-window/window-state-change'

Vue.createApp({
  data() {
    return {
      isRequestingFileOpen: false,
      fileUrl: '',
      fileDetails: {} as ImageFileDetails,
      settings: {} as VideSettingsModel,
      isWindowMaximized: false,
    }
  },
  async created() {
    this.settings = await window.ipc.requestSettings()

    window.ipc.maximizedStatusChanged(newState => {
      this.isWindowMaximized = newState
    })
  },
  methods: {
    async openFileDialog() {
      this.isRequestingFileOpen = true

      try {
        const fr = await window.ipc.requestOpenFile()

        if (fr && !fr.wasCancelled) {
          this.fileUrl = fr.filePath
          this.actionFilePicked()
        }
      } finally {
        this.isRequestingFileOpen = false
      }
    },
    async actionFilePicked() {
      if (!this.isFileLoaded) return
      const details = await window.ipc.requestFileDetails(
        this.validatedFilePath
      )
      console.log(details)
      this.fileDetails = details
    },
    requestClose() {
      window.ipc.requestWindowStateChange(WindowStateChange.CLOSE_WINDOW)
    },
    requestMinimize() {
      window.ipc.requestWindowStateChange(WindowStateChange.MINIMIZE_WINDOW)
    },
    requestMaxiMiniMize() {
      if (this.isWindowMaximized) {
        window.ipc.requestWindowStateChange(
          WindowStateChange.UN_MAXIMIZE_WINDOW
        )
      } else {
        window.ipc.requestWindowStateChange(WindowStateChange.MAXIMIZE_WINDOW)
      }
    },
  },
  computed: {
    validatedFilePath(): string {
      const f = (this.fileUrl as string)?.trim() ?? ''
      return f.length == 0 ? '' : f
    },
    validatedFileUrl(): string {
      const f = this.validatedFilePath
      return f.length == 0 ? '' : `file://${f}`
    },
    isFileLoaded(): boolean {
      return (this.validatedFileUrl as string).length > 0
    },
    titleBarStyle() {
      return {
        height: `${this.settings.titleBarHeight}px`,
      }
    },
    contentViewerStyle() {
      return {
        'margin-top': this.titleBarHeight,
        'margin-bottom': this.statusBarHeight,
      }
    },
    statusBarStyle() {
      return {
        height: `${this.settings.statusBarHeight}px`,
      }
    },
  },
}).mount('#app')
