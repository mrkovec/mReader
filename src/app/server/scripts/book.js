'use strict'
import Path from 'path'
import Fs from 'fs'
import {TempPath, ComicExt, BookExt} from './../../conf'
import {ReadFile, WriteFile, ListFiles, DeleteFile, ExistsFile, ExtractFromArchive} from './util'
import {ParseEbook, OpenEbook} from './ebook'
import {ParseComic} from './comic'

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
      this.type = 'comic'
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
    this.info = null

    switch (this.type) {
      case 'ebook':
        return ParseEbook(this)
      case 'comic':
        return ParseComic(this)
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
      switch (this.type) {
        case 'ebook':
          return OpenEbook(this)
        case 'comic':
          return book// OpenComic(this)
        default:
          throw new Error('unknown book type')
      }
    })
  }
  getInfo () {
    let book = this
    return new Promise(function (resolve, reject) {
      if (book.info) {
        resolve(book.info)
      } else {
        let infofile = Path.join(TempPath, Path.basename(book.file), 'nfo.json')
        return ExistsFile(infofile).catch(() => {
          return null
        }).then(() => {
          return ReadFile(infofile).then((info) => {
            book.info = JSON.parse(info)
            resolve(book.info)
          })
        })
      }
    })
  }
  set bookInfo (info) {
    this.info = info
    let infofile = Path.join(TempPath, Path.basename(this.file), 'nfo.json')
    WriteFile(infofile, JSON.stringify(this.info))
    // let book = this
    // this.info = info
    // if (!toFile) {
    //   return new Promise(function (resolve, reject) { resolve(this) })
    // } else {
    //   let infofile = Path.join(TempPath, Path.basename(this.file), 'nfo.json')
    //   return WriteFile(infofile, JSON.stringify(this.info))
    // }
  }
}
