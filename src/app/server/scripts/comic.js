'use strict'

import Path from 'path'

import {TempPath} from './../../conf'
import {ListFromArchive, ExtractFromArchive, ReadFile, ExistsFile, WriteFile} from './util'

export function OpenComic (book) {
  // let indexPromises = book.body.map((htmlfile, i) => {
  //   return ReadFile(htmlfile).then((html) => {
  //     let title = html.match(title_rx).map((a) => {
  //       return a.replace(/<\/?title>/g, '')
  //     })
  //     let kap = {}
  //     kap.i = i
  //     kap.title = title[0]
  //     let body = html.match(body_rx).map((a) => {
  //       return a.replace(/<\/?body>/ig, '')
  //     })
  //     kap.text = body[0] // .replace(/<img[^>]*>/g, '')
  //     return kap
  //   })
  // })
  // return Promise.all(indexPromises).then((kaps) => {
  //   let allkaps = []
  //   kaps.forEach((k) => {
  //     allkaps = allkaps.concat(k)
  //   })
  //   // allkaps = allkaps.filter((k, i, arr) => {
  //   //   if (i === 0) {
  //   //     return true
  //   //   }
  //   //
  //   // })
  //   allkaps.sort((a, b) => {
  //     return a.i - b.i
  //   })
  //   book.kap = allkaps
  //   return book
  // })
}

const comic_rx = /^(.+) (\d{3}) .+/i

export function ParseComic (book) {
  let cb = book.file.match(comic_rx)
  if (cb) {
    return ListFromArchive(book.fullPath, '-i!*.jpg').then((files) => {
      book.name = cb[1]
      book.issue = Number(cb[2])
      book.body = files
      return ExtractFromArchive(book.fullPath, Path.basename(files[0]), 'x').then(() => {
        return book.getInfo().then((info) => {
          if (info) {
            book.bookInfo = info
            return book
          }
          book.bookInfo = {added: (new Date()), readOffset: 0}
          return book
          // return book.setInfo(info).then(() => {
          //   return book
          // })
        })
        // let infofile = Path.join(TempPath, Path.basename(book.file), 'nfo.json')
        // return ExistsFile(infofile).catch(() => {
        //   book.info = {added: (new Date()), lastReadPage: 1}
        //   return WriteFile(infofile, JSON.stringify(book.info)).then(() => {
        //     return book
        //   })
        // }).then(() => {
        //   return ReadFile(infofile).then((info) => {
        //     book.info = JSON.parse(info)
        //     return book
        //   })
        // })
      })
    })
  }
}
