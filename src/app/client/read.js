import React from 'react'
import ReactDOM from 'react-dom'
import IpcRenderer from 'ipc-renderer'

import Book from './views/book.jsx'
import InjectTapEventPlugin from 'react-tap-event-plugin'

window.onload = () => {
  InjectTapEventPlugin()
  console.log('window.onload')
  IpcRenderer.on('book', (event, msg) => {
    console.log('IpcRenderer.on')
    ReactDOM.render(<Book book={msg} />, document.getElementById('book'))
  })
}
