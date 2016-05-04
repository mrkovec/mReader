'use strict'
import Path from 'path'
import {ListFromArchive, ExtractFromArchive, WriteFile} from './util'
const comic_rx = /^(.+) (\d{3}) .+/i
const comic_rx_tpb1 = /^(.+) v(\d*\d) +-*(\D*) \(\d{4}\).+/i
const comic_rx_tpb2 = /^(.+) vol *(\d*\d) +-* *(\D*) \(\d{4}\).+/i
const comic_rx_tpb3 = /^(.+) tpb.+/i

export function ParseComic (book) {
  return ListFromArchive(book.fullPath, '-i!*.jpg').then((files) => {
    let cb = book.file.match(comic_rx)
    if (cb) {
      book.name = cb[1]
      book.issue = '#' + cb[2]
    }

    if (!book.issue) {
      cb = book.file.match(comic_rx_tpb1)

      if (cb) {
        // console.log(cb)
        book.name = cb[1]
        book.issue = `vol. ${cb[2]} ${cb[3]}`
      }
    }

    if (!book.issue) {
      cb = book.file.match(comic_rx_tpb2)

      if (cb) {
        // console.log(cb)
        book.name = cb[1]
        book.issue = `vol. ${cb[2]} ${cb[3]}`
      }
    }
    if (!book.issue) {
      cb = book.file.match(comic_rx_tpb3)
      if (cb) {
        book.name = cb[1]
        book.issue = 'TPB'
      }
    }

    book.body = files
    return ExtractFromArchive(book.fullPath, Path.basename(files[0]), 'x').then(() => {
      book.info = {added: (new Date()), readOffset: 0}
      return WriteFile(Path.join(book.dataPath, 'book.info'), JSON.stringify(book)).then(() => {
        return book
      })
    })
  })
}
