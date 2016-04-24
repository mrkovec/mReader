import React from 'react'
import LibItem from './libitem'
// import {LoadLibrary} from './../main'



export default class Lib extends React.Component {
  constructor (props) {
    super(props)
  }

  filterReadState (readState, book) {
    switch (readState) {
      case 'progress':
        return (Number(book.info.lastPage) > 0 & Number(book.info.lastPage) < book.img.length)
      case 'unread':
        return (Number(book.info.lastPage) < book.img.length)
      case 'read':
        return (Number(book.info.lastPage) === book.img.length)
      default:
        return true
    }
  }

  filterBookType (bookType, book) {
    switch (bookType) {
      case 'comics':
        return (book.type === 'comics')
      case 'ebook':
        return (book.type === 'ebook')
      default:
        return true
    }
  }

  processLibrary (library, groupByName) {
    let lib = 'no books found'
    if (library.length > 0) {
      if (groupByName) {
        let names = new Map()
        library.forEach((book) => {
          if (names.has(book.name)) {
            let exb = names.get(book.name)
            exb = exb.concat(book)
            names.set(book.name, exb)
          } else {
            names.set(book.name, [book])
          }
        })
        let i = 0
        lib = []
        names.forEach(function (value, key) {
          lib = lib.concat((
            <div key={i}>
              <LibItem book={{type: 'comics', name: key, nested: value}} />
            </div>
          ))
          i = i + 1
        }, names)
        // console.log([...names.keys()])
      }
      let i = 0
      lib = library.map((book) => {
        <div key={i}>
          <LibItem book={book} />
          </div>
          i = i + 1
      })

    }
    return lib
  }

  render () {
    // return null
    let {library, settings} = this.props
    let {readState, bookType, groupByName} = settings
    let lib = this.processLibrary(library, groupByName)

    // console.log(library)
//     let lib = 'no books found'
//     if (library.length > 0) {
// // style={{'background-image': `url('${encodeURI(book.img[0])}')`, 'background-size': 'cover', 'background-position': 'center center'}}
//       lib = library.map((book, i) => {
//         if (this.filterReadState(readState, book) & this.filterBookType(bookType, book)) {
//           return (
//             <div key={i} className='itemContainer'>
//               <LibItem book={book} />
//               <LinearProgress mode='determinate' min={1} max ={book.img.length} value={Number(book.info.lastPage)} />
//             </div>
//           )
//         }
//       })
//     }
    return (
      <div className='libContainer'>
        {lib}
      </div>
    )
  }
}
