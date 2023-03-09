import { VideSettingsModel } from './vide-settings-model'

const _defaults: VideSettingsModel = {
  defaultWindowLocation: {
    x: 0.5,
    y: 0.5,
  },
  defaultWindowSize: {
    x: 100,
    y: 100,
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
}

export default _defaults
