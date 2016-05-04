// import App from 'app'
// import Path from 'path'
import Setings from './settings.json'

// export let AppSettings = Set
// export let AppPath
// export let DataPath
// export let TempPath
// export function SetAppPath (path) {
//   // // console.log(path)
//   AppPath = path
// }
// export function SetDataPath (path) {
//   DataPath = path
// }
// export function SetTempPath (path) {
//   TempPath = path
// }
global.AppSettings = Setings
export function SetAppPath (path) {
  global.AppPath = path
}
export function SetDataPath (path) {
  global.DataPath = path
}
export function SetTempPath (path) {
  global.TempPath = path
}

export const BookExt = '.epub.pdf'
export const ComicExt = '.cbz.cbr'
