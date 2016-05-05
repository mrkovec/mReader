'use strict'
import App from 'app'
import IpcMain from 'ipc-main'
import BrowserWindow from 'browser-window'
import Path from 'path'
import {PrintErr, WriteFile} from './scripts/util'
import {SetAppPath, SetDataPath, SetTempPath} from './../conf.js'
import {SyncLibrary, ClearLibrary, UpdateLibrary, AddLibrary} from './scripts/library'
import {Book} from './scripts/book'

let mainWindow = null
// let webContents = null
App.on('quit', () => {
  // // console.log(global.AppSettings)
  // WriteFile(`${global.AppPath}/src/app/settings.json`, JSON.stringify(global.AppSettings)).catch((err) => {
  //   PrintErr(err, 'settings')
  // }).then((a) => {
  //   // console.log(a)
  // })
})

App.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    App.quit()
  }
})
App.on('ready', () => {
  SetAppPath(App.getAppPath())
  SetDataPath(App.getPath('userData'))
  SetTempPath(Path.join(App.getPath('temp'), 'mReader'))

  mountIPC()

  mainWindow = new BrowserWindow({width: 800, height: 600, title: global.AppSettings.name})
  mainWindow.setMenu(null)
  mainWindow.loadURL(`file://${global.AppPath}/src/app/client/index.html`)
  // mainWindow.webContents.openDevTools()
  // webContents = mainWindow.webContents
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

function mountIPC () {
  IpcMain.on('error', (err) => {
    PrintErr(err)
  })

  IpcMain.on('library', (event, arg) => {
    let {type, book, path} = arg
    // // console.log(type)
    // // console.log(book)
    switch (type) {
      case 'sync':
        SyncLibrary().then((res) => {
          // if (global.AppSettings.lastOpenBook) {
          //   let book = new Book(global.AppSettings.lastOpenBook)
          //   book.open().then((resp) => {
          //     sendResponse(event.sender, {book: global.AppSettings.lastOpenBook, library: res})
          //   }).catch((err) => {
          //     PrintErr(err, 'IpcMain.on book open')
          //     sendResponse(event.sender, {error: err})
          //   })
          // } else {
          sendResponse(event.sender, {library: res, info: `library synced susesfully`})
          // }
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library sync')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'clear':
        ClearLibrary().then(() => {
          sendResponse(event.sender, {library: [], info: `library cleared`})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library clear')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'update':
        UpdateLibrary(new Book(book)).then((res) => {
          sendResponse(event.sender, {library: res})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library update')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'add':
        AddLibrary(path).then((res) => {
          sendResponse(event.sender, {library: res})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library add')
          sendResponse(event.sender, {error: err})
        })
        break
      default:
        console.error(`unknown msg type ${type} in ${arg}`)
    }
  })
  IpcMain.on('book', (event, arg) => {
    // // console.log(arg)
    let {type, msg} = arg
    let book = new Book(msg)
    switch (type) {
      case 'open':
        book.open().then((resp) => {
          // global.AppSettings.lastOpenBook = resp
          sendResponse(event.sender, {book: resp})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on book open')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'clear':
        book.clear().then((resp) => {
          sendResponse(event.sender, {book: resp})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on book open')
          sendResponse(event.sender, {error: err})
        })
        break
      default:
        console.error(`unknown msg type ${type} in ${arg}`)
    }
  })
  IpcMain.on('settings', (event, set) => {
    WriteFile(`${global.AppPath}/src/app/settings.json`, JSON.stringify(set)).catch((err) => {
      PrintErr(err, 'settings')
      sendResponse(event.sender, {error: err})
    }).then((a) => {
      // console.log(a)
    })
  })
  IpcMain.on('quit', () => {
    // global.AppSettings.lastOpenBook = null
    App.quit()
  })
}

function sendResponse (sender, msg) {
  let {library, book, info, error} = msg
  if (library) {
    sender.send('library', library)
  }
  if (book) {
    sender.send('book', book)
  }
  if (info) {
    sender.send('info', info)
  }
  if (error) {
    sender.send('error', error)
  }
}
