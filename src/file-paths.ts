import * as path from 'path'

/**
 * Path of the preload script within dist.
 */
const PRELOAD_PATH = path.join(__dirname, 'preload.js')
/**
 * Path of the index html file within dist.
 */
const INDEX_HTML_PATH = path.join(__dirname, 'index.html')

export { PRELOAD_PATH, INDEX_HTML_PATH }
