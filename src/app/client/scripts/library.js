'use strict'
// import Path from 'path'
import Book from './book'

export default class Library {
  constructor (data) {
    this.data = data
    this.changed = true
    this.temp = {}
    this.groupfnc = null
    this.sortfnc = null
    this.filterfnc = null
    this.filterfnc2 = null
  }
  // updateBook (data) {
  //   console.log(data)
  //   let {book, info, author, name} = data
  //   let i = -1
  //   this.data.forEach((b, k) => {
  //     if (i < 0) {
  //       if (b.fullPath === book) {
  //         i = k
  //       }
  //     }
  //   })
  //   if (info) {
  //
  //   }
  //   if (author) {
  //     console.log(this.data[i].author)
  //     this.data[i].author = author
  //     console.log(this.data[i].author)
  //   }
  //   if (name) {
  //
  //   }
  // }
  filterBy (fnc) {
    this.changed = true
    this.filterfnc = fnc
  }
  filterBy2 (fnc) {
    this.changed = true
    this.filterfnc2 = fnc
  }
  sortBy (fnc) {
    this.changed = true
    this.sortfnc = fnc
  }
  groupBy (fnc) {
    this.changed = true
    this.groupfnc = fnc
  }
  get books () {
    if (!this.changed) {
      return this.temp
    }
    let books = this.data
    // this.filterfnc.forEach((f) => {
      // books = books.filer(f)
    // })
    // console.log(this.filterfnc)
    if (this.filterfnc) {
      books = books.filter(this.filterfnc)
    }
    if (this.filterfnc2) {
      books = books.filter(this.filterfnc2)
    }
    if (this.sortfnc) {
      books.sort(this.sortfnc)
    }
    if (this.groupfnc) {
      let group = new Map()
      books.forEach((book) => {
        let par = this.groupfnc(book)
        if (group.has(par)) {
          let exb = group.get(par)
          exb = exb.concat(book)
          group.set(par, exb)
        } else {
          group.set(par, [book])
        }
      })
      books = [...group.values()].map((bs) => {
        let b = bs[0]
        if (bs.length > 1) {
          b = new Book({type: bs[0].type, name: bs[0].name})
          b.nested = bs // .slice(1)
        }
        return b
      })
    }
    this.changed = false
    this.temp = books
    return books
  }
}
