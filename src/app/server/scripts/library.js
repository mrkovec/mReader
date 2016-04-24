'use strict'
// import App from 'app'
import Fs from 'fs'
import Path from 'path'

// import ParseComics from './comics.js'
import {ParseComics} from './comics'
import {ParseBook} from './ebook'

import {AppPath, BookExt, ComicsExt} from './../../conf'
const libPath = Path.join(AppPath, 'lib.json')

export function AddSyncLibrary (path) {
  return AddLibrary(path).then(() => {
    return SyncLibrary()
  })
}

export function AddLibrary (path) {
  return readLibrary(libPath).then((lib) => {
    if (!lib.includes(path)) {
      lib = lib.concat(path)
    }
    return writeLibrary(lib, libPath)
  })
}


/* export function ReadLibrary (oldlib) {
  return readLibrary(libPath).then((lib) => {
    if (oldlib) {
      oldlib.forEach((book) => {
        try {
          Fs.statSync(book.file)
        } catch (err) {
          book.img.forEach((imgfile) => {
            try {
              Fs.unlinkSync(`${imgfile}`)
            } catch (err) {
              console.log(err)
            }
          })
        }
      })
    }
    return new Promise((resolve, reject) => {
      let library = []
      lib.forEach((dir) => {
        dir = Path.normalize(dir)
        try {
          let files = getFiles(dir)
        /*  let files = getFiles(dir).filter((file) => {
            return !exbooks.includes(file)
          })
          console.log('files')
          console.log(files)*/
          /* library = library.concat(ParseComicsSync(dir, files))
        } catch (err) {
          reject(err)
        }
      })
      resolve(library)
    })
  })
}*/

export function SyncLibrary () {
  return readLibrary().then((lib) => {
    let promises = lib.map((dir) => {
      let files = getFiles(dir)
      return ParseComics(dir, files).then((comics) => {
        return ParseBook(dir, files).then((books) => {
          books = comics.concat(books)
          // console.log(book)
          return books
        })
      })
    })
    return Promise.all(promises)
  })
}



/*
export default class ReaderLibrary {
  constructor (onReply) {
    this.replyHandler = onReply
    this.data = null
  }

  sync (requester) {
    readLibrary(libPath).then((resp) => {
      resp = resp.filter((book) => {
        let p = Path.join(book.libpath, book.relpath, book.file)
        try {
          Fs.statSync(p)
        } catch (err) {
          return false
        }
        return true
      })
      return resp
    }).then((resp) => {
      let libs = new Map()
      resp = resp.forEach((book) => {
        if (!libs.has(book.libpath)) {
          libs.set(book.libpath)
        }
      })
      this.data = null
      for (let libpath of libs.keys()) {
        this.add(requester, libpath)
      }
    }).catch((err) => {
      this.replyHandler(requester, requester, {error: err})
    })
  }

  add (requester, path) {
    getBooks(path).then((lib) => {
      if (lib.length > 0) {
        if (!this.data) {
          this.data = []
        }
        this.data = this.data.concat(lib)
        this.replyHandler(requester, {library: this.data, info: `${lib.length} books added susesfully`})
        this.save(requester)
      } else {
        this.replyHandler(requester, {error: 'no books to be added'})
      }
    })
  }

  save (requester) {
    writeLibrary(this.data, libPath).then(() => {
      this.replyHandler(requester, {info: 'library sucesfully saved'})
    }, (err) => {
      this.replyHandler(requester, {error: err})
    })
  }

  read (requester) {
    readLibrary(libPath).then((resp) => {
      this.data = resp
      this.replyHandler(requester, {library: this.data, info: `library sucesfully read (${this.data.lengtg}) books`})
    }, function (err) {
      this.replyHandler(requester, {error: err})
    })
  }
}

function getBooks (dir) {
  return new Promise((resolve) => {
    dir = Path.normalize(dir)
    let library = getFiles(dir)
    resolve(ParseComics(dir, library))
  })
}
*/

export function ExistsFile (path) {
  return new Promise(function (resolve, reject) {
    Fs.stat(path, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}

export function ReadFile (path) {
  return new Promise(function (resolve, reject) {
    Fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(null)
        } else {
          reject(err)
        }
      } else {
        resolve(data)
      }
    })
  })
}

export function WriteFile (path, data) {
  return new Promise((resolve, reject) => {
    Fs.writeFile(path, JSON.stringify(data), 'utf8', 'w', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function readLibrary () {
  return new Promise(function (resolve, reject) {
    Fs.readFile(libPath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([])
        } else {
          reject(err)
        }
      } else {
        resolve(JSON.parse(data))
      }
    })
  })
}

function writeLibrary (library, path) {
  return new Promise((resolve, reject) => {
    Fs.writeFile(path, JSON.stringify(library), 'utf8', 'w', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function getFiles (dir, files_) {
  dir = Path.normalize(dir)
  files_ = files_ || []
  let files = Fs.readdirSync(dir)
  for (var i in files) {
    let name = dir + '/' + files[i]
    if (Fs.statSync(name).isDirectory()) {
      getFiles(name, files_)
    } else if (Fs.statSync(name).isFile() & `${BookExt}${ComicsExt}`.indexOf(Path.extname(name)) >= 0) {
      files_.push(name)
    }
  }
  return files_
}

function uuid4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
