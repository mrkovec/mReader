import Path from 'path'
import exec from 'child_process'
import Fs from 'fs'

import {TempPath, ComicsExt} from './../../conf'
import {ExistsFile, WriteFile, ReadFile} from './library'

const comics_rx = /^(.+) (\d{3}) .+/i
const comic_rx_tpb1 = /^(.+) v(\d*\d) .+/i
const comic_rx_tpb2 = /^(.+) vol *(\d*\d) .+/i
const comic_rx_tpb3 = /^(.+) tpb.+/i

export function OpenComics (book) {
  return new Promise(function (resolve, reject) {
console.log(book.img)
    if (book.img.some((p) => {
      try {
        Fs.statSync(p)
      } catch (err) {
        return true
      }
    })) {
      let archfile = Path.join(book.libpath, book.relpath, book.file)
      exec.exec(`7z e "${archfile}" -o"${Path.join(TempPath, Path.basename(archfile))}" -r -y`, (err) => {
        if (err) {
          reject(err)
        }
      })
    }
    resolve(book)
  })
}

export function ParseComics (dir, files) {
  let promises = files.map((file) => {
    let book = Path.basename(file)
    if (`${ComicsExt}`.indexOf(Path.extname(book)) >= 0) {
      let cb = book.match(comics_rx)
      if (cb) {
        file = Path.normalize(file)
        let comics = {type: 'comics', name: cb[1], issue: Number(cb[2]), libpath: dir, relpath: Path.dirname(Path.relative(dir, file)), file: book}
        return ListBook(file).then((imgs) => {
          comics.img = imgs
          let infofile = Path.join(TempPath, Path.basename(comics.file), 'nfo.json')
          return ExtractCover(file, imgs[0], comics).then(() => {
            return ExistsFile(infofile).catch(() => {
              let info = {added: (new Date()), lastPage: 1}
              return WriteFile(infofile, info).then(() => {
                comics.info = info
                return comics
              })
            }).then(() => {
              return ReadFile(infofile).then((info) => {
                comics.info = JSON.parse(info)
                return comics
              })
            })
          })
        })
      }
    }
        /* console.log(book.match(comics_rx))
        console.log(book.match(comic_rx_tpb1))
        console.log(book.match(comic_rx_tpb2))
        console.log(book.match(comic_rx_tpb3))*/
  })
  return Promise.all(promises)
}

export function ExtractCover (archfile, file, comics) {
  return new Promise(function (resolve, reject) {
    exec.exec(`7z e "${archfile}" -o"${Path.join(TempPath, Path.basename(archfile))}" "${Path.basename(file)}" -r -y`, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(comics)
      }
    })
  })
}

export function ListBook (file) {
  return new Promise(function (resolve, reject) {
    let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.D][\.R][\.H][\.S][\.A]) +(\d+) +(\d+)? +(.+)/
    let imgs = []
    exec.exec(`7z l "${file}" -r -i!*.jpg`, {encoding: 'utf8'}, (error, stdout, stderr) => {
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

export function ParseComicsSync (dir, files) {
  let library = files.map((file) => {
    let book = Path.basename(file)
    let cb = book.match(comics_rx)
    if (cb) {
      file = Path.normalize(file)
      let comics = {type: 'comics', name: cb[1], issue: Number(cb[2]), libpath: dir, relpath: Path.dirname(Path.relative(dir, file)), file: book}
      comics.img = listArchive(file)
      extractArchive(file, comics.img[0])
      return comics
    }
      /* console.log(book.match(comics_rx))
      console.log(book.match(comic_rx_tpb1))
      console.log(book.match(comic_rx_tpb2))
      console.log(book.match(comic_rx_tpb3))*/
  })
  return library
}



/* export default function ParseComics (dir, files) {
  return new Promise(function (resolve, reject) {
    let library = files.map((file) => {
      let book = Path.basename(file)
      let cb = book.match(comics_rx)
      if (cb) {
        file = Path.normalize(file)
        let comics = {type: 'comics', name: cb[1], issue: Number(cb[2]), libpath: dir, relpath: Path.dirname(Path.relative(dir, file)), file: book}
        comics.img = listArchive(file)
        try {
          extractArchive(file, comics.img[0])
        } catch (err) {
          reject(err)
        }
        return comics
      }
      console.log(book.match(comics_rx))
      console.log(book.match(comic_rx_tpb1))
      console.log(book.match(comic_rx_tpb2))
      console.log(book.match(comic_rx_tpb3))
    })
    resolve(library)
  })
}*/

function extractArchive (archfile, file) {
  if (file === undefined) {
    exec.execSync(`7z e "${archfile}" -o"${Path.join(TempPath, Path.basename(archfile))}" -r -y`)
  } else {
    exec.execSync(`7z e "${archfile}" -o"${Path.join(TempPath, Path.basename(archfile))}" "${Path.basename(file)}" -r -y`)
  }
}

function listArchive (file) {
  let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.D][\.R][\.H][\.S][\.A]) +(\d+) +(\d+)? +(.+)/
  let imgs = []
  exec.execSync(`7z l "${file}" -r -i!*.jpg`, {encoding: 'utf8'}).split('\n').forEach((line) => {
    let info = line.match(regex)
    if (info) {
      imgs = imgs.concat(Path.join(TempPath, Path.basename(file), Path.basename(info[5])))
    }
  })
  return imgs.sort()
}
