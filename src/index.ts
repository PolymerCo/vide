import { app } from 'electron'
import { VideWindowController } from './vide-window/vide-window-controller'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

new VideWindowController(app)
