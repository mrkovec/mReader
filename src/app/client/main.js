'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import IpcRenderer from 'ipc-renderer'
import WebFrame from 'web-frame'
import Settings from './../settings.json'
import Book from './scripts/book'
import Library from './scripts/library'
import App from './views/app'
import InjectTapEventPlugin from 'react-tap-event-plugin'

export let Lib = {}
let appRef = {}

window.onload = () => {
  mountIPC()
  IpcRenderer.send('library', {type: 'sync'})
  InjectTapEventPlugin()
  Lib = new Library([])
  WebFrame.setZoomLevel(Settings.zoomlevel)
  render()
}

function render (props) {
  appRef = ReactDOM.render(<App library = {Lib} {...props} />, document.getElementById('app'))
}

function mountIPC () {
  IpcRenderer.on('error', (event, err) => {
    // console.log(err)
  })
  IpcRenderer.on('info', (event, info) => {
    // console.log(info)
    // appRef.snackbarMessage(info)
  })
  IpcRenderer.on('library', (event, library) => {
    Lib = new Library(library.map((book) => {
      return new Book(book)
    }))
    render()
  })
  IpcRenderer.on('book', (event, book) => {
    render({book: new Book(book)})
    appRef.handleAppChange({view: 'book'})
  })
}
