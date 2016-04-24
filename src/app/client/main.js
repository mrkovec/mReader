import IpcRenderer from 'ipc-renderer'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './views/app.jsx'
// import {lazyLoadImages} from './views/book'

import InjectTapEventPlugin from 'react-tap-event-plugin'

let bookLibrary = []
let appRef = {}

window.onload = () => {
  bookLibrary = LoadLibrary()
  InjectTapEventPlugin()
  mountIPC()
  //IpcRenderer.send('library', {type: 'sync'})
  //IpcRenderer.send('library', {type: 'add', msg: 'c:\\mmr\\rozne\\electron\\worspace\\reader\\lib'})
  render()
  //lazyLoadImages()
}

function render (props) {
  appRef = ReactDOM.render(<App library = {bookLibrary} {...props} />, document.getElementById('app'))
}

function mountIPC () {
  IpcRenderer.on('error', (event, err) => {
    console.log('IpcRenderer.on(error)')
    console.log(err)
  })
  IpcRenderer.on('info', (event, info) => {
    console.log('IpcRenderer.on(info)')
    console.log(info)
    appRef.snackbarMessage(info)
  })
  IpcRenderer.on('library', (event, library) => {
    console.log(library)
    bookLibrary = library
    saveLibrary(bookLibrary)
    render()
  })
  IpcRenderer.on('book', (event, book) => {
    console.log('IpcRenderer.on(book)')
    render({book: book})
    appRef.handleAppChange({view: 'book'})
  })
  IpcRenderer.on('progress', (event, prg) => {
    console.log('progress ' + prg)
    appRef.setLoading(prg)
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

// function isElementInViewport (el) {
//     var rect = el.getBoundingClientRect();
//     return (
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
//         rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
//     )
// }
//
// window.addEventListener("DOMContentLoaded", lazyLoadImages);
// window.addEventListener("load", lazyLoadImages);
// window.addEventListener("resize", lazyLoadImages);
// window.addEventListener("scroll", lazyLoadImages);
//
// function lazyLoadImages() {
//   let images = document.querySelectorAll("img[data-src]")
//
//   // load images that have entered the viewport
//   images.forEach(function (item) {
//     if (isElementInViewport(item)) {
//       item.setAttribute("src",item.getAttribute("data-src"));
//       item.removeAttribute("data-src")
//     }
//   })
//   // if all the images are loaded, stop calling the handler
//   if (images.length == 0) {
//     window.removeEventListener("DOMContentLoaded", lazyLoadImages);
//     window.removeEventListener("load", lazyLoadImages);
//     window.removeEventListener("resize", lazyLoadImages);
//     window.removeEventListener("scroll", lazyLoadImages);
//   }
// }
