'use strict'
import Path from 'path'
import {AppPath, ComicExt, BookExt} from './../../conf'
import {ReadFile, ListFiles, WriteFile} from './util'
import {Book} from './book'

export function UpdateLibrary (book) {
  return SyncLibrary().then((lib) => {
    let i = -1
    lib.forEach((b, k) => {
      if (i < 0) {
        if (b.fullPath === book.fullPath & b.type === book.type) {
          i = k
        }
      }
    })
    if (i >= 0) {
      lib[i].author = book.author
      lib[i].name = book.name
      lib[i].info.readOffset = book.info.readOffset
      lib[i].info.zoom = book.info.zoom
      return WriteFile(Path.join(lib[i].dataPath, 'book.info'), JSON.stringify(lib[i])).then(() => {
        return lib
      })
    }
    return lib
  })
}

export function ClearLibrary () {
  return ReadFile(Path.join(AppPath, 'lib.json')).then((libs) => {
    return Promise.all(JSON.parse(libs).map((libdir) => {
      return Promise.all(ListFiles(libdir).map((file) => {
        return (new Book({file: file})).clear()
      }))
    }))
  })
}

export function SyncLibrary () {
  let allbooks = []
  return ReadFile(Path.join(AppPath, 'lib.json')).then((libs) => {
    let libpromises = JSON.parse(libs).map((libdir) => {
      let bookpromises = ListFiles(libdir, null, (f) => { return `${BookExt}${ComicExt}`.indexOf(Path.extname(f)) >= 0 }).map((file) => {
        return new Book().parse(libdir, file)
      })
      return Promise.all(bookpromises)
    })
    return Promise.all(libpromises)
  }).then((books) => {
    books.forEach((b) => {
      allbooks = allbooks.concat(b)
    })
    return allbooks
  })
  //     })).then((a) => {
  //       console.log('fuu')
  //       console.log(a)
  //     })
  //   })).then((books) => {
  //     console.log('kkkuu')
  //     console.log(books)
  //     books.forEach((b) => {
  //       allbooks = allbooks.concat(b)
  //     })
  //     return allbooks
  //   })
  // })
}
