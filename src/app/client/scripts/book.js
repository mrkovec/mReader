'use strict'
import Path from 'path'

export default class Book {
  constructor (data) {
    if (data) {
      let {type, name, author, issue, libpath, relpath, file, body, info, kap} = data
      this.type = type
      this.name = name
      this.author = author
      this.issue = issue
      this.libpath = libpath
      this.relpath = relpath
      this.file = file
      this.body = body
      this.info = info
      this.kap = kap
    }
  }

  get fname () {
    switch (this.type) {
      case 'ebook':
        return this.name
      case 'pdf':
        return this.name
      case 'comic':
        return this.issue
      default:
        return 'unknown book'
    }
  }

  get sname () {
    switch (this.type) {
      case 'ebook':
        return this.author
      case 'pdf':
        return this.author
      case 'comic':
        return this.name
      default:
        return 'unknown book'
    }
  }
  get fullPath () {
    return Path.join(this.libpath, this.relpath, this.file)
  }

  get unread () {
    return (this.info.readOffset < 99)
  }
  get read () {
    return (this.info.readOffset >= 99)
  }
  get inprogress () {
    return (this.info.readOffset > 0) & (this.info.readOffset <= 99)
  }

}
