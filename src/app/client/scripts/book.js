'use strict'
import React from 'react'
import Path from 'path'
import BookIcon from 'material-ui/svg-icons/action/book'
import BubbleIcon from 'material-ui/svg-icons/communication/chat-bubble'
// import PDFIcon from 'material-ui/svg-icons/image/picture-as-pdf'

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
  get printname () {
    switch (this.type) {
      case 'ebook':
        return this.name
      case 'pdf':
        return this.name
      case 'comic':
        return this.issue ? `${this.name} ${this.issue}` : this.name
      default:
        return 'unknown book'
    }
  }
  get printauthor () {
    switch (this.type) {
      case 'ebook':
        return this.author
      case 'pdf':
        return this.author
      case 'comic':
        return this.author
      default:
        return 'unknown book'
    }
  }
  get groupname () {
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
  get icon () {
    switch (this.type) {
      case 'ebook':
        return <BookIcon/>
      case 'pdf':
        return <BookIcon/>
      case 'comic':
        return <BubbleIcon/>
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
