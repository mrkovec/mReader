import App from 'app'
import Path from 'path'

export const AppPath = App.getPath('userData')
export const TempPath = Path.join(App.getPath('temp'), 'mReader')

export const BookExt = '.epub'
export const ComicExt = '.cbz.cbr'
