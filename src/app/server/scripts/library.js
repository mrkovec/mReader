'use strict'

import Path from 'path'
import Fs from 'fs'

import {TempPath, AppPath, ComicExt, BookExt} from './../../conf'
import {ReadFile, ListFiles, DeleteFile, ExistsFile, ExtractFromArchive} from './util'
import {ParseEbook, OpenEbook} from './ebook'

export class Book {
  constructor (data) {
    if (data) {
      let {type, name, author, issue, libpath, relpath, file, body, info} = data
      this.type = type
      this.name = name
      this.author = author
      this.issue = issue
      this.libpath = libpath
      this.relpath = relpath
      this.file = file
      this.body = body
      this.info = info
    }
  }

  get fullPath () {
    return Path.join(this.libpath, this.relpath, this.file)
  }
  get dataPath () {
    return Path.join(TempPath, Path.basename(this.file))
  }

  parse (dir, file) {
    dir = Path.normalize(dir)
    file = Path.normalize(file)

    this.type = 'x'
    if (ComicExt.indexOf(Path.extname(file)) >= 0) {
      this.type = 'comics'
    }
    if (BookExt.indexOf(Path.extname(file)) >= 0) {
      this.type = 'ebook'
    }
    this.name = Path.basename(file)
    this.author = ''
    this.issue = ''
    this.libpath = dir
    this.relpath = Path.dirname(Path.relative(dir, file))
    this.file = this.name
    this.body = []

    switch (this.type) {
      case 'ebook':
        return ParseEbook(this)
      case 'comics':
        return 'ok'
      default:
        throw new Error('unknown book type')
    }
  }

  clear () {
    // let tmpdir = Path.join(TempPath, Path.basename(this.file))
    return ExistsFile(this.dataPath).then(() => {
      return Promise.all(ListFiles(this.dataPath, null, (f) => { return Path.basename(f) !== 'nfo.json' }).map((file) => {
        return DeleteFile(file)
      }))
    }).catch(() => { return 'ok' })
  }

  open () {
    let book = this
    return new Promise(function (resolve, reject) {
      if (book.body.some((p) => {
        try {
          Fs.statSync(p)
        } catch (err) {
          return true
        }
      })) {
        resolve(ExtractFromArchive(book.fullPath, '*.*', 'x'))
      }
      resolve('ok')
    }).then(() => {
      return OpenEbook(this)
    })
  }

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
    return Promise.all(JSON.parse(libs).map((libdir) => {
      return Promise.all(ListFiles(libdir, null, (f) => { return `${BookExt}`.indexOf(Path.extname(f)) >= 0 }).map((file) => {
        return (new Book()).parse(libdir, file)
      }))
    })).then((books) => {
      books.forEach((b) => {
        allbooks = allbooks.concat(b)
      })
      return allbooks
    })
  })
}
