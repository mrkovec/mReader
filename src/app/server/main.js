'use strict'

import App from 'app'
import IpcMain from 'ipc-main'
import BrowserWindow from 'browser-window'

import {SyncLibrary, ClearLibrary, UpdateLibrary} from './scripts/library'
import {Book} from './scripts/book'
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
    let {type, book} = arg
    // console.log(type)
    // console.log(book)
    switch (type) {
      case 'sync':
        SyncLibrary().then((res) => {
          sendResponse(event.sender, {library: res, info: `library synced susesfully`})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library sync')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'clear':
        ClearLibrary().then(() => {
          sendResponse(event.sender, {info: `library cleared`})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library clear')
          sendResponse(event.sender, {error: err})
        })
        break
      case 'update':
        UpdateLibrary(new Book(book)).then((res) => {
          // console.log(res)
          sendResponse(event.sender, {library: res})
        }).catch((err) => {
          PrintErr(err, 'IpcMain.on library update')
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
          PrintErr(err, 'IpcMain.on book open')
          sendResponse(event.sender, {error: err})
        })
        break
      default:
        console.log(`unknown msg type ${type} in ${arg}`)
    }
  })

  IpcMain.on('readOffset', (event, arg) => {
    let {offset, file} = arg
    let book = new Book({file: file})
    book.getInfo().then((info) => {
      info.readOffset = offset
      // console.log(info)
      book.bookInfo = info
    }).catch((err) => {
      PrintErr(err, 'IpcMain.on readOffset getInfo')
    })
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
