import { VideSettingsModel } from './vide-settings-model'

const _defaults: VideSettingsModel = {
  defaultWindowLocation: {
    x: 0.5,
    y: 0.5,
  },
  defaultWindowSize: {
    width: 250,
    height: 250,
  },
  minimumWindowSize: {
    width: 150,
    height: 150,
  },
  imageExtensions: [
    'apng',
    'avif',
    'bmp',
    'gif',
    'jpg',
    'jpeg',
    'jpe',
    'jif',
    'jfif',
    'png',
    'svg',
    'tif',
    'tiff',
    'webp',
    'xmb',
  ],
  titleBarHeight: 30,
  statusBarHeight: 25,
  showDecorations: false,
}

export default _defaults
