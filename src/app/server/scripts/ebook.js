'use strict'

import Path from 'path'

import {TempPath} from './../../conf'
import {ListFromArchive, ExtractFromArchive, ReadFile, ParseXML, ExistsFile, WriteFile} from './util'

// const head_rx = /<title>(.*?)<\/title>/gi
const title_rx = /<title[^>]*>((.|[\n\r])*)<\/title>/im
const body_rx = /<body[^>]*>((.|[\n\r])*)<\/body>/im
const head_rx = /<head[^>]*>((.|[\n\r])*)<\/head>/im

export function OpenEbook (book) {
  let indexPromises = book.body.map((htmlfile, i) => {
    return ReadFile(htmlfile).then((html) => {
      let title = html.match(title_rx).map((a) => {
        return a.replace(/<\/?title>/g, '')
      })
      // return ParseXML(head, false).then((data) => {
      //   let css = data.head.link.filter((link) => {
      //     return link['$'].type === 'text/css'
      //   }).map((link) => {
      //     return link['$'].href
      //   })
      //
      //   console.log(css)
        let kap = {}
        kap.i = i
        kap.title = title[0]
        let body = html.match(body_rx).map((a) => {
          return a.replace(/<\/?body>/ig, '')
        })
        kap.text = body[0].replace(/<img[^>]*>/g, '')
        return kap
      // })


      // return ParseXML(html, true).then((data) => {
      //   let kap = {}
      //   kap.i = i
      //   kap.title = data.html.head[0].title[0]
      //   kap.text = data.html.body[0]
      //   return kap
      // })
    })
  })
  return Promise.all(indexPromises).then((kaps) => {
    let allkaps = []
    kaps.forEach((k) => {
      allkaps = allkaps.concat(k)
    })
    allkaps.sort((a, b) => {
      return a.i - b.i
    })
    book.kap = allkaps
    return book
  })
}

export function ParseEbook (book) {
  // return ListFromArchive(book.fullPath, '-i!content.opf -i!*.html -i!*.xhtml').then((files) => {
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
          let infofile = Path.join(TempPath, Path.basename(book.file), 'nfo.json')
          return ExistsFile(infofile).catch(() => {
            book.info = {added: (new Date()), lastReadPage: 1}
            return WriteFile(infofile, JSON.stringify(book.info)).then(() => {
              return book
            })
          }).then(() => {
            return ReadFile(infofile).then((info) => {
              book.info = JSON.parse(info)
              return book
            })
          })
        })
      })
    })
  })
}
