'use strict'
import Path from 'path'
import {ListFromArchive, ExtractFromArchive, WriteFile} from './util'
const comic_rx = /^(.+) (\d{3}) .+/i

export function ParseComic (book) {
  return ListFromArchive(book.fullPath, '-i!*.jpg').then((files) => {
    let cb = book.file.match(comic_rx)
    if (cb) {
      book.name = cb[1]
      book.issue = Number(cb[2])
      book.body = files
      return ExtractFromArchive(book.fullPath, Path.basename(files[0]), 'x').then(() => {
        book.info = {added: (new Date()), readOffset: 0}
        return WriteFile(Path.join(book.dataPath, 'book.info'), JSON.stringify(book)).then(() => {
          return book
        })
      })
    }
  })
}
