import { Point } from 'electron'
import { ImageFile } from './file/image-file'
import { ImageFileDetails } from './file/image-file-details'
import { VideSettingsModel } from './settings/vide-settings-model'
import { WindowStateChange } from './vide-window/window-state-change'

Vue.createApp({
  data() {
    return {
      isRequestingFileOpen: false,
      loadedFile: {} as ImageFile,
      settings: {} as VideSettingsModel,
      isWindowMaximized: false,
      platform: {} as NodeJS.Platform,
      zoomLevel: 1,
      imageOffset: { x: 0, y: 0 },
      dimensionMoveRatio: { width: 1, height: 1 },
      primaryMouseDown: false,
      lastMousePosition: {} as Point,
    }
  },
  async created() {
    this.settings = await window.ipc.requestSettings()
    this.platform = await window.ipc.requestPlatform()

    window.ipc.maximizedStatusChanged(newState => {
      this.isWindowMaximized = newState
    })

    const htmlElement = document.getElementsByTagName('html')?.item(0)

    this.setupOnWheel(htmlElement)
    this.setupOnDblClick(htmlElement)
    this.setupOnMouseMove(htmlElement)
  },
  methods: {
    async openFileDialog() {
      this.isRequestingFileOpen = true

      try {
        const fr = await window.ipc.requestOpenFile()

        if (fr && !fr.wasCancelled) {
          this.loadedFile = fr.data

          // if dimensions are present, set the dimension ratios
          if (fr.data?.details.dimensions) {
            const { width, height } = fr.data.details.dimensions
            const max = Math.max(width, height)

            this.dimensionMoveRatio = {
              width: max / width,
              height: max / height,
            }
          } else {
            // otherwise set defaults
            this.dimensionMoveRatio = { width: 1, height: 1 }
          }
        }
      } finally {
        this.isRequestingFileOpen = false
      }
    },
    requestClose() {
      window.ipc.requestWindowStateChange(WindowStateChange.CLOSE_WINDOW)
    },
    requestMinimize() {
      window.ipc.requestWindowStateChange(WindowStateChange.MINIMIZE_WINDOW)
    },
    requestMaxiMiniMize() {
      // toggle current maximized state
      const state = this.isWindowMaximized
        ? WindowStateChange.UN_MAXIMIZE_WINDOW
        : WindowStateChange.MAXIMIZE_WINDOW

      window.ipc.requestWindowStateChange(state)
    },
    setupOnWheel(htmlElement: HTMLElement) {
      htmlElement.onwheel = e => {
        this.onWheel(e)
      }
    },
    setupOnDblClick(htmlElement: HTMLElement) {
      htmlElement.ondblclick = e => {
        if (e.button == 0) this.requestMaxiMiniMize()
      }
    },
    setupOnMouseMove(htmlElement: HTMLElement) {
      htmlElement.onmousemove = e => {
        if ((e.buttons & 1) == 1) this.onDrag(e)
      }
    },
    onWheel(e: WheelEvent): void {
      // handle as pinch/zoom
      if (e.ctrlKey) {
        const { zoomSensitivity, zoomSensitivityGain, maxZoom, minZoom } =
          this.settings

        // create zoom constant that acts as the new zoom target
        const z =
          this.zoomLevel -
          e.deltaY * (zoomSensitivity + this.zoomLevel * zoomSensitivityGain)

        // clamp new zoom level
        this.zoomLevel = Math.min(maxZoom, Math.max(z, minZoom))
      } else {
        const {
          moveSensitivity,
          moveSensitivityLoss,
          moveMax,
          moveSensitivityLossThreshold,
        } = this.settings

        // get current zoom level and clamp to ensure zoom threshold hasn't been reached,
        // ensuring that scrolling doesn't become sluggish on high zoom levels
        const zL = Math.min(this.zoomLevel, moveSensitivityLossThreshold)

        // calculate desired move deltas
        let dX = e.deltaX * moveSensitivity * Math.pow(moveSensitivityLoss, zL)
        let dY = e.deltaY * moveSensitivity * Math.pow(moveSensitivityLoss, zL)

        // adjust for the dimension ratios to ensure consistent x/y scrolling
        dX *= this.dimensionMoveRatio.width
        dY *= this.dimensionMoveRatio.height

        // calculate final offsets and clamp between min and max offsets
        const fX = Math.max(
          -moveMax,
          Math.min(moveMax, this.imageOffset.x - dX)
        )
        const fY = Math.max(
          -moveMax,
          Math.min(moveMax, this.imageOffset.y - dY)
        )

        this.imageOffset = { x: fX, y: fY }
      }
    },
    onDrag(e: MouseEvent) {
      const {
        moveSensitivity,
        moveSensitivityLoss,
        moveMax,
        moveSensitivityLossThreshold,
      } = this.settings

      const mousePosition = {
        x: e.screenX,
        y: e.screenY,
      }

      const mouseDelta = {
        x: mousePosition.x - this.lastMousePosition.x,
        y: mousePosition.y - this.lastMousePosition.y,
      }

      // get current zoom level and clamp to ensure zoom threshold hasn't been reached,
      // ensuring that scrolling doesn't become sluggish on high zoom levels
      const zL = Math.min(this.zoomLevel, moveSensitivityLossThreshold)

      // calculate desired move deltas
      let dX =
        mouseDelta.x * moveSensitivity * Math.pow(moveSensitivityLoss, zL)
      let dY =
        mouseDelta.y * moveSensitivity * Math.pow(moveSensitivityLoss, zL)

      // adjust for the dimension ratios to ensure consistent x/y scrolling
      dX *= this.dimensionMoveRatio.width
      dY *= this.dimensionMoveRatio.height

      // calculate final offsets and clamp between min and max offsets
      const fX = Math.max(-moveMax, Math.min(moveMax, this.imageOffset.x - dX))
      const fY = Math.max(-moveMax, Math.min(moveMax, this.imageOffset.y - dY))

      this.imageOffset = { x: fX, y: fY }

      this.lastMousePosition = mousePosition
    },
  },
  computed: {
    isFileLoaded(): boolean {
      // ensure is not null and is not blank data
      return (
        this.loadedFile &&
        (this.loadedFile as ImageFile).fileData &&
        (this.loadedFile as ImageFile).fileData != ''
      )
    },
    titleBarStyle() {
      return {
        height: `${this.settings.titleBarHeight}px`,
        // flip order of items on MacOS to replicate left-size title-bar buttons
        'flex-direction': this.platform == 'darwin' ? 'row-reverse' : 'row',
      }
    },
    contentViewerStyle() {
      return {
        'margin-top': this.titleBarHeight,
        'margin-bottom': this.statusBarHeight,
      }
    },
    contentImageStyle() {
      const scaling = this.zoomLevel
      const translate = this.imageOffset

      return {
        transform: `scale(${scaling}) translate(${translate.x}%, ${translate.y}%)`,
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
      if (d.size) e.push(window.dataUtil.bytesToReadableSize(d.size))
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
      if (d.lens) e.push(d.lens)
      if (d.fNumber) e.push(`ƒ/${d.fNumber}`)
      if (d.focalLength) e.push(`${d.focalLength}mm`)
      if (d.exposureTime) {
        if (d.exposureTime > 0.5) {
          e.push(window.timeUtil.secondsToReadableTime(d.exposureTime))
        } else {
          e.push(`1/${Math.round(1 / d.exposureTime)}`)
        }
      }
      if (d.iso) e.push(`ISO${d.iso}`)

      return e
    },
    hasCameraDetailsEntries(): boolean {
      return this.fileDetailsEntries.length > 0
    },
    fileData(): string {
      return (this.loadedFile as ImageFile).fileData
    },
    fileDetails(): ImageFileDetails {
      return (this.loadedFile as ImageFile).details
    },
    viewDetailsEntries(): string[] {
      const e: string[] = []

      e.push(`${Math.round(this.zoomLevel * 100)}%`)

      return e
    },
  },
}).mount('#app')
