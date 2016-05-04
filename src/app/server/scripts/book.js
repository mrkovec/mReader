'use strict'
import Path from 'path'
import Fs from 'fs'
import {ComicExt, BookExt} from './../../conf'
import {ReadFile, ListFiles, DeleteFile, ExistsFile, ExtractFromArchive} from './util'
import {ParseEbook, OpenEbook, ParsePDF} from './ebook'
import {ParseComic} from './comic'

export class Book {
  constructor (data) {
    if (data) {
      this.bookData = data
    }
  }
  set bookData (data) {
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
  get fullPath () {
    return Path.join(this.libpath, this.relpath, this.file)
  }
  get dataPath () {
    return Path.join(global.TempPath, Path.basename(this.file))
  }
  parse (dir, file) {
    dir = Path.normalize(dir)
    file = Path.normalize(file)
    this.file = Path.basename(file)

    let bookfile = Path.join(this.dataPath, 'book.info')
    return ExistsFile(bookfile).then(() => {
      return ReadFile(bookfile).then((data) => {
        this.bookData = new Book(JSON.parse(data))
        return this
      })
    }).catch(() => {
      this.type = 'x'
      if (ComicExt.indexOf(Path.extname(file)) >= 0) {
        this.type = 'comic'
      }
      if (BookExt.indexOf(Path.extname(file)) >= 0) {
        this.type = 'ebook'
        if (Path.extname(file) === '.pdf') {
          this.type = 'pdf'
        }
      }
      this.name = this.file
      this.author = ''
      this.issue = ''
      this.libpath = dir
      this.relpath = Path.dirname(Path.relative(dir, file))
      this.body = []
      this.info = null
      // console.log('parse')
      // // console.log(this)
      switch (this.type) {
        case 'ebook':
          return ParseEbook(this)
        case 'comic':
          return ParseComic(this)
        case 'pdf':
          return ParsePDF(this)
        default:
          throw new Error('unknown book type')
      }
    })
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
        case 'pdf':
          return book
        case 'comic':
          return book// OpenComic(this)
        default:
          throw new Error('unknown book type')
      }
    })
  }
  // getInfo () {
  //   let infofile = Path.join(TempPath, Path.basename(this.file), 'nfo.json')
  //   return ExistsFile(infofile).catch(() => {
  //     return null
  //   }).then(() => {
  //     return ReadFile(infofile).then((info) => {
  //       this.info = JSON.parse(info)
  //       return this
  //     })
  //   })

    // let book = this
    // return new Promise(function (resolve, reject) {
    //   if (book.info) {
    //     resolve(book.info)
    //   } else {
    //     let infofile = Path.join(TempPath, Path.basename(book.file), 'nfo.json')
    //     return ExistsFile(infofile).catch(() => {
    //       reject(null)
    //     }).then(() => {
    //       return ReadFile(infofile).then((info) => {
    //         book.info = JSON.parse(info)
    //         resolve(book.info)
    //       })
    //     })
    //   }
    // })
  // }
  // set bookInfo (info) {
  //   this.info = info
  //   let infofile = Path.join(TempPath, Path.basename(this.file), 'nfo.json')
  //   WriteFile(infofile, JSON.stringify(this.info))
  //   // let book = this
  //   // this.info = info
  //   // if (!toFile) {
  //   //   return new Promise(function (resolve, reject) { resolve(this) })
  //   // } else {
  //   //   let infofile = Path.join(TempPath, Path.basename(this.file), 'nfo.json')
  //   //   return WriteFile(infofile, JSON.stringify(this.info))
  //   // }
  // }
}
