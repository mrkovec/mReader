'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import IpcRenderer from 'ipc-renderer'

import Book from './scripts/book'
import Library from './scripts/library'
import App from './views/app'
// import {GetPDFinfo} from './views/pdf'

import InjectTapEventPlugin from 'react-tap-event-plugin'

// export let Library = []
export let Lib = {}

let appRef = {}

window.onload = () => {
  // Library = LoadLibrary().map((book) => {
  //   return new Book(book)
  // })

  mountIPC()
  IpcRenderer.send('library', {type: 'sync'})
  InjectTapEventPlugin()
  Lib = new Library([])
  render()
  // if (Library.length === 0) {

  // }
}

function render (props) {
  appRef = ReactDOM.render(<App library = {Lib} {...props} />, document.getElementById('app'))
}

function mountIPC () {
  IpcRenderer.on('error', (event, err) => {
    console.log(err)
  })

  IpcRenderer.on('info', (event, info) => {
    console.log(info)
    // appRef.snackbarMessage(info)
  })

  IpcRenderer.on('library', (event, library) => {
    Lib = new Library(library.map((book) => {
      return new Book(book)
    }))
    console.log(Lib)
        // console.log(Library)
    render()
    // saveLibrary(Library)
  })

  IpcRenderer.on('book', (event, book) => {
    render({book: new Book(book)})
    appRef.handleAppChange({view: 'book'})
  })

  // IpcRenderer.on('util', (event, msg) => {
  //   let {type, data} = msg
  //   switch (type) {
  //     case 'pdfinfo':
  //       GetPDFinfo(data).then((info) => {
  //         event.sender.send('pdfinfo', info)
  //       }).catch((err) => {
  //         console.log(err)
  //       })
  //       break
  //   }
  // })
}

// export function LoadLibrary () {
//   let lib = JSON.parse(localStorage.getItem('library'))
//   if (lib) {
//     return lib
//   }
//   return []
// }
//
// function saveLibrary (lib) {
//   localStorage.setItem('library', JSON.stringify(lib))
// }
