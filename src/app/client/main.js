'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import IpcRenderer from 'ipc-renderer'

import Book from './scripts/book'
import App from './views/app'

import InjectTapEventPlugin from 'react-tap-event-plugin'

export let Library = []

let appRef = {}

window.onload = () => {
  // Library = LoadLibrary().map((book) => {
  //   return new Book(book)
  // })
  render()
  mountIPC()
  InjectTapEventPlugin()
  // if (Library.length === 0) {
    IpcRenderer.send('library', {type: 'sync'})
  // }
}

function render (props) {
  appRef = ReactDOM.render(<App library = {Library} {...props} />, document.getElementById('app'))
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
    Library = library.map((book) => {
      return new Book(book)
    })
    console.log(Library)
    render()
    saveLibrary(Library)
  })

  IpcRenderer.on('book', (event, book) => {
    console.log(book)
    render({book: new Book(book)})
    appRef.handleAppChange({view: 'book'})
  })
}

export function LoadLibrary () {
  let lib = JSON.parse(localStorage.getItem('library'))
  if (lib) {
    return lib
  }
  return []
}

function saveLibrary (lib) {
  localStorage.setItem('library', JSON.stringify(lib))
}
