import { app } from 'electron'
import { VideSettings } from './settings/vide-settings'
import { VideWindowController } from './vide-window-controller'

const settings = new VideSettings()

const win = new VideWindowController(app)
