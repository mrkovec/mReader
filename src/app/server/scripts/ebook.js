'use strict'

import Path from 'path'
// import {TempPath} from './../../conf'
import {ListFromArchive, ExtractFromArchive, ReadFile, WriteFile, ParseXML, CreateDir} from './util'

// const head_rx = /<title>(.*?)<\/title>/gi
const title_rx = /<title[^>]*>((.|[\n\r])*)<\/title>/im
const body_rx = /<body[^>]*>((.|[\n\r])*)<\/body>/im
// const head_rx = /<head[^>]*>((.|[\n\r])*)<\/head>/im
// const img_rx = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g
// const link_rx = /<link[^>]*((.)*)\/>/gi
// const href_rx = /href="(.*)"/g

export function OpenEbook (book) {
  let indexPromises = book.body.map((htmlfile, i) => {
    return ReadFile(htmlfile).then((html) => {
      let kap = {}
      kap.i = i
      let title = html.match(title_rx)
      if (title) {
        title = title.map((a) => {
          if (a) {
            return a.replace(/<\/?title>/g, '')
          }
          return ''
        })
        kap.title = title[0]
      }
      let body = html.match(body_rx)
      if (body) {
        body = body.map((a) => {
          return a.replace(/<\/?body>/ig, '')
        })
        kap.text = body[0] // .replace(/<img[^>]*>/g, '')
      }
      return kap
    })
  })
  return Promise.all(indexPromises).then((kaps) => {
    let allkaps = []
    kaps.forEach((k) => {
      allkaps = allkaps.concat(k)
    })
    // allkaps = allkaps.filter((k, i, arr) => {
    //   if (i === 0) {
    //     return true
    //   }
    //
    // })
    allkaps.sort((a, b) => {
      return a.i - b.i
    })
    book.kap = allkaps
    return book
  })
}

export function ParseEbook (book) {
  return ListFromArchive(book.fullPath, '-i!content.opf').then((files) => {
    let opf = files[0]
    return ExtractFromArchive(book.fullPath, Path.basename(opf), 'x').then(() => {
      return ReadFile(opf).then((xml) => {
        return ParseXML(xml, false).then((data) => {
          book.name = data.package.metadata[0]['dc:title'][0]
          book.author = data.package.metadata[0]['dc:creator'][0]['_']
          book.body = data.package.manifest[0].item.filter((item) => {
            if (item['$']['media-type'] === 'application/xhtml+xml') {
              return true
            }
            return false
          }).map((item) => {
            return Path.join(Path.dirname(opf), item['$']['href'])
          })
          book.info = {added: (new Date()), readOffset: 0}
          return WriteFile(Path.join(book.dataPath, 'book.info'), JSON.stringify(book)).then(() => {
            return book
          })
        })
      })
    })
  })
}

export function ParsePDF (book) {
  // // console.log(book)
  return CreateDir(book.dataPath).then(() => {
    book.info = {added: (new Date()), readOffset: 0}
    return WriteFile(Path.join(book.dataPath, 'book.info'), JSON.stringify(book)).then(() => {
      return book
    })
  })
}
