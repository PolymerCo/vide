Vue.createApp({
  data() {
    return {
      fileUrl: '',
    }
  },
  methods: {
    async openFileDialog() {
      const fr = await window.ipc.requestOpenFile()

      if (fr && !fr.wasCancelled) {
        this.fileUrl = fr.filePath
      }
    },
    actionFileLoad(fileUrl: string) {},
  },
  computed: {
    validatedFileUrl(): string {
      let f = (this.fileUrl as string)?.trim() ?? ''

      if (f.length == 0) {
        return ''
      }

      return f
    },
    isFileLoaded(): boolean {
      return (this.validatedFileUrl as string).length > 0
    },
  },
}).mount('#app')
