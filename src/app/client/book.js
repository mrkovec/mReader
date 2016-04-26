'use strict'

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
        return this.author
      case 'comics':
        return this.name
      default:
        return 'unknown book'
    }
  }

  get sname () {
    switch (this.type) {
      case 'ebook':
        return this.name
      case 'comics':
        return this.issue
      default:
        return 'unknown book'
    }
  }

}
