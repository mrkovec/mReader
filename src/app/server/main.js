'use strict'

import App from 'app'
import IpcMain from 'ipc-main'
import BrowserWindow from 'browser-window'

import {SyncLibrary, ClearLibrary, Book} from './scripts/library'
import {PrintErr} from './scripts/util'

let mainWindow = null

App.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    App.quit()
  }
})

App.on('ready', () => {
  mountIPC()

  mainWindow = new BrowserWindow({width: 1000, height: 600})
  mainWindow.loadURL(`file://${App.getAppPath()}/src/app/client/index.html`)
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

function mountIPC () {
  IpcMain.on('error', (err) => {
    PrintErr(err)
  })

  IpcMain.on('library', (event, arg) => {
    let {type} = arg
    switch (type) {
      case 'sync':
        SyncLibrary().then((res) => {
          sendResponse(event.sender, {library: res, info: `library synced susesfully`})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library / sync')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'clear':
        ClearLibrary().then(() => {
          sendResponse(event.sender, {info: `library cleared`})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library / clear')
          sendResponse(event.sender, {error: err})
        })
        break
      default:
        console.log(`unknown msg type ${type} in ${arg}`)
    }
  })

  IpcMain.on('book', (event, arg) => {
    // console.log(arg)
    let {type, msg} = arg
    switch (type) {
      case 'open':
        let book = new Book(msg)
        book.open().then((resp) => {
          sendResponse(event.sender, {book: resp})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on book / open')
          sendResponse(event.sender, {error: err})
        })
        break
      default:
        console.log(`unknown msg type ${type} in ${arg}`)
    }
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
