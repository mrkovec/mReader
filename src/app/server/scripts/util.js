'use strict'
import Fs from 'fs'
import Path from 'path'
import Exec from 'child_process'
import xml2js from 'xml2js'

import {TempPath} from './../../conf'

export function CreateDir (dir) {
  return new Promise(function (resolve, reject) {
    Fs.mkdir(dir, (err) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(`dir ${dir} created`)
      }
    })
  })
}

export function PrintErr (err, source) {
  if (source) {
    console.error(source)
  }
  console.error(err.stack)
}

export function ParseXML (xml, iattr = true) {
  return new Promise(function (resolve, reject) {
    let parser = new xml2js.Parser({ignoreAttrs: iattr})
    parser.parseString(xml, function (err, result) {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(result)
      }
    })
  })
}

export function ListFromArchive (archfile, ipar = '') {
  return new Promise(function (resolve, reject) {
    let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.D][\.R][\.H][\.S][\.A]) +(\d+) +(\d+)? +(.+)/
    let list = []
    // exec.exec(`7z l "${file}" -r -i!content.opf -i!*.html -i!*.xhtml`, {encoding: 'utf8'}, (error, stdout, stderr) => {
    Exec.exec(`7z l "${archfile}" -r ${ipar}`, {encoding: 'utf8'}, (err, stdout, stderr) => {
      if (err) {
        console.log(`ListFromArchive (${archfile}, ${ipar}) = ${err}`)
        reject(new Error(err))
      }
      stdout.split('\n').forEach((line) => {
        let info = line.match(regex)
        if (info) {
          // console.log(info)
          list = list.concat(Path.join(TempPath, Path.basename(archfile), info[5]))
        }
      })
      resolve(list.sort())
    })
  })
}

export function ExtractFromArchive (archfile, file, pr = 'e', out) {
  if (!out) {
    out = Path.join(TempPath, Path.basename(archfile))
  }
  return new Promise(function (resolve, reject) {
    Exec.exec(`7z ${pr} "${archfile}" -o"${out}" "${Path.basename(file)}" -r -y`, (err) => {
      if (err) {
        console.log(`ExtractFromArchive (${archfile}, ${file}, ${pr}, ${out}) = ${err}`)
        reject(new Error(err))
      } else {
        resolve(`${archfile} extracted`)
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
          console.log(`ReadFile (${path}) = ${err}`)
          reject(new Error(err))
        }
      } else {
        resolve(data)
      }
    })
  })
}

export function WriteFile (path, data) {
  return new Promise((resolve, reject) => {
    Fs.writeFile(path, data, 'utf8', 'w', (err) => {
      if (err) {
        console.log(`WriteFile (${path}) = ${err}`)
        reject(new Error(err))
      } else {
        resolve(`${path} file writed`)
      }
    })
  })
}

export function ListFiles (dir, files_, filter) {
  files_ = files_ || []
  let files = Fs.readdirSync(dir)
  for (var i in files) {
    let name = Path.join(dir, files[i])
    if (Fs.statSync(name).isDirectory()) {
      ListFiles(name, files_, filter)
    } else if (Fs.statSync(name).isFile()) {
      if (filter) {
        if (filter(name)) {
          files_.push(name)
        }
      } else {
        files_.push(name)
      }
    }
  }
  return files_
}

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

export function DeleteFile (path) {
  return new Promise(function (resolve, reject) {
    Fs.unlink(path, (err) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(`${path} deleted`)
      }
    })
  })
}

function uuid4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
