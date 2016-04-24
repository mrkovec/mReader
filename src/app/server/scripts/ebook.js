import Path from 'path'
import exec from 'child_process'
import xml2js from 'xml2js'

import {ReadFile} from './library'
import {ExtractCover} from './comics'
import {TempPath, BookExt} from './../../conf'

export function ParseBook (dir, files) {
  let promises = files.map((file) => {
    let book = Path.basename(file)
    if (`${BookExt}`.indexOf(Path.extname(book)) >= 0) {
      file = Path.normalize(file)
      let ebook = {type: 'ebook', name: book, author: '', libpath: dir, relpath: Path.dirname(Path.relative(dir, file)), file: book}
      return listBook(file).then((ob) => {
        let opf = {}
        let html = ob.map((file) => {
          if (Path.basename(file) === 'content.opf') {
            opf = file
          } else {
            return file
          }
        })
        ebook.html = html.sort()
        return ReadFile(opf).then((xml) => {
          return parseBook(xml, ebook)
        })
        // return ebook
      })
    }
  })
  return Promise.all(promises)
}

function parseBook (xml, ebook) {
  return new Promise(function (resolve, reject) {
    let parser = new xml2js.Parser({ignoreAttrs: true})
    parser.addListener('end', function (result) {
        // console.dir(result.package.metadata[0])
      ebook.name = result.package.metadata[0]['dc:title'][0]
      ebook.author = result.package.metadata[0]['dc:creator'][0]
      resolve(ebook)
    })
    parser.parseString(xml)
  })
}

function listBook (file) {
  return new Promise(function (resolve, reject) {
    let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.D][\.R][\.H][\.S][\.A]) +(\d+) +(\d+)? +(.+)/
    let imgs = []
    // exec.exec(`7z l "${file}" -r -i!content.opf`, {encoding: 'utf8'}, (error, stdout, stderr) => {
    exec.exec(`7z l "${file}" -r -i!content.opf -i!*.html -i!*.xhtml`, {encoding: 'utf8'}, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      stdout.split('\n').forEach((line) => {
        let info = line.match(regex)
        if (info) {
          imgs = imgs.concat(Path.join(TempPath, Path.basename(file), Path.basename(info[5])))
        }
      })
      // console.log(imgs.sort())
      resolve(imgs.sort())
    })
  })
}
