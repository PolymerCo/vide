import _defaults from './vide-settings-default'
import { VideSettingsModel } from './vide-settings-model'

export class VideSettings {
  constructor() {}

  public get(): VideSettingsModel {
    return _defaults
  }
}
