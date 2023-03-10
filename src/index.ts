import { app } from 'electron'
import { VideSettings } from './settings/vide-settings'
import { VideController } from './vide-controller'
import { WindowStateService } from './vide-window/window-state-service'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

new VideController(app, new VideSettings(), new WindowStateService())
