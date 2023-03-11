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
      platform: '',
    }
  },
  async created() {
    this.settings = await window.ipc.requestSettings()
    this.platform = await window.ipc.requestPlatform()

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

      this.fileDetails = await window.ipc.requestFileDetails(
        this.validatedFilePath
      )
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
        'flex-direction': this.platform == 'darwin' ? 'row-reverse' : 'row',
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
    fileDetailsEntries(): string[] {
      const d: ImageFileDetails = this.fileDetails
      const e: string[] = []
      if (d.dimensions) e.push(`${d.dimensions.width}x${d.dimensions.height}`)
      if (d.colorType) e.push(d.colorType)
      if (d.bitDepth) e.push(`${d.bitDepth}-bit`)
      return e
    },
    hasFileDetailsEntries(): boolean {
      return this.fileDetailsEntries.length > 0
    },
    cameraDetailsEntries(): string[] {
      const d: ImageFileDetails = this.fileDetails
      const e: string[] = []
      if (d.fNumber) e.push(`ƒ/${d.fNumber}`)
      if (d.focalLength) e.push(`${d.focalLength}mm`)
      if (d.exposureTime) {
        if (d.exposureTime > 1) {
          e.push(window.timeUtil.secondsToReadableTime(d.exposureTime))
        } else {
          e.push(`1/${Math.round(1 / d.exposureTime)}`)
        }
      }
      if (d.iso) e.push(`ISO ${d.iso}`)

      return e
    },
    hasCameraDetailsEntries(): boolean {
      return this.fileDetailsEntries.length > 0
    },
  },
}).mount('#app')
