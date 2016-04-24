'use strict'
import App from 'app'
import IpcMain from 'ipc-main'
import BrowserWindow from 'browser-window'
import Path from 'path'

// import ReaderLibrary from './scripts/library.js'
import {AddSyncLibrary, SyncLibrary, ExistsFile, WriteFile, ReadFile} from './scripts/library'
import {OpenComics} from './scripts/comics'

import {TempPath} from './../conf'

let mainWindow = null

//let mainLibrary = new ReaderLibrary(sendIPCresponse)

App.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    App.quit()
  }
})

/* export function load (file) {
  mainWindow.loadURL(file)
}*/

App.on('ready', () => {
  mountIPC()

  // console.log(`file://${App.getPath('userData')}/lib.json`)
  // console.log(getFiles(`${app.getAppPath()}/src/app`))
  /* console.log(`home file://${App.getPath("home")}`)
  console.log(`appData file://${App.getPath("appData")}`)
  console.log(`userData file://${App.getPath("userData")}`)
  console.log(`temp file://${App.getPath("temp")}`)
  console.log(`cache file://${App.getPath("cache")}`)*/
  /* console.log(`temp file://${App.getPath("userData")}`)
  console.log(`temp file://${App.getPath("appData")}`)*/
  mainWindow = new BrowserWindow({width: 1000, height: 600})
  // mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.loadURL(`file://${App.getAppPath()}/src/app/client/index.html`)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

function mountIPC () {
  IpcMain.on('error', (err) => {
    console.log(err)
  })
  IpcMain.on('library', (event, arg) => {
    console.log('IpcMain.on(library)')

    let {type, msg} = arg
    switch (type) {
      case 'add':
        let {path} = msg
        let comics = []
        AddSyncLibrary(path).then((com) => {
          com.forEach((c) => {
            comics = comics.concat(c)
          })
          let pr = comics.map((comic) => {
            let nfo = Path.join(TempPath, Path.basename(comic.file), 'nfo.json')
            return ExistsFile(nfo).catch(() => {
              return WriteFile(nfo, {added: (new Date()).toJSON(), lastPage: 1})
            })
          })
          return Promise.all(pr)
        }).then(() => {
          sendIPCresponse(event.sender, {library: comics, info: `library added susesfully`})
        }).catch((err) => {
          console.log(err)
          sendIPCresponse(event.sender, {error: err})
        })
        break
      case 'sync':
        SyncLibrary().then((com) => {
          let comics = []
          com.forEach((c) => {
            comics = comics.concat(c)
          })
          // console.log(comics)
          comics = comics.filter((book) => {
            if (book) {
              return true
            }
          })
          sendIPCresponse(event.sender, {library: comics, info: `library sync susesfully`})
        }).catch((err) => {
          console.log(err)
          sendIPCresponse(event.sender, {error: err})
        })
        break
      default:
        console.log(`unknown msg type ${type} in ${arg}`)
    }
  })

  IpcMain.on('book', (event, arg) => {
    // console.log('IpcMain.on(book)')
    let {type, msg} = arg
    switch (type) {
      case 'open':
        // console.log('open')
        OpenComics(msg).then((resp) => {
          sendIPCresponse(event.sender, {book: resp})
        }, function (err) {
          sendIPCresponse(event.sender, {error: err})
        })
        break
      default:
        console.log(`unknown msg type ${type} in ${arg}`)
    }
  })

  IpcMain.on('lastPage', (event, arg) => {
    console.log('IpcMain.on(lastPage)')
    let {page, file} = arg
    let infofile = Path.join(TempPath, Path.basename(file), 'nfo.json')
    ReadFile(infofile).then((info) => {
      info.lastPage = page
      return WriteFile(infofile, info).then(() => {
        return SyncLibrary()
      })
    }).catch((err) => {
      console.log(err)
    })
  })
}

function sendIPCresponse (sender, msg) {
  console.log('sendIPCresponse')
  let {library, info, error, book} = msg
  if (library) {
    sender.send('library', library)
  }
  if (book) {
    sender.send('book', book)
  }
  if (info) {
    console.log(info)
    sender.send('info', info)
  }
  if (error) {
    console.log(error)
    sender.send('error', error)
  }
}

function progStart () {
  console.log('progStart')
  mainWindow.webContents.send('progress', true)
}
function progStop () {
  console.log('progStop')
  mainWindow.webContents.send('progress', false)
}
