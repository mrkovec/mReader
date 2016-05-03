import React from 'react'
import LibItem from './libitem'

import {List} from 'material-ui/List'
// import Library from './../scripts/library'
// import {Lib from './../main'

export default class Lib extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let {library} = this.props
    let {readState, bookType, search, groupByName, sortBy} = this.props.settings
    switch (readState) {
      case 'unread':
        library.filterBy((b) => { return b.unread })
        break
      case 'progress':
        library.filterBy((b) => { return b.inprogress })
        break
      case 'read':
        library.filterBy((b) => { return b.read })
        break
      default:
        library.filterBy(null)
    }
    library.filterBy2(null)
    if (bookType) {
      library.filterBy2((b) => { return (bookType === 'all') | (b.type === bookType) | (b.type === 'pdf' & bookType === 'ebook') })
    }
    library.sortBy(null)
    switch (sortBy) {
      case 'name':
        library.sortBy((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
        break
      case 'added':
        library.sortBy((a, b) => {
          if (a.info.added < b.info.added) {
            return -1
          }
          if (a.info.added > b.info.added) {
            return 1
          }
          return 0
        })
        break
      case 'read':
        library.sortBy((a, b) => {
          console.log(a.info.read + '-' + b.info.read)
          if (!a.info.read & !b.info.read) {
            return 0
          }
          if (!a.info.read) {
            return 1
          }
          if (!b.info.read) {
            return -1
          }
          if (a.info.read < b.info.read) {
            return -1
          }
          if (a.info.read > b.info.read) {
            return 1
          }
          return 0
        })
        break
      default:
        library.sortBy(null)
    }
    library.groupBy(null)
    if (groupByName) {
      library.groupBy((b) => { return b.sname })
    }
    library.search(search)

    library = library.books
    let lib = 'no books found'
    if (library.length > 0) {
      lib = library.map((book, i) => {
        return (
          <section key={i} className='itemContainer'>
            <LibItem book={book} />
          </section>
        )
      })
    }
    return (
      <section className='libContainer'>
        <List>
          {lib}
        </List>
      </section>
    )
  }
}
Lib.propTypes = {
  library: React.PropTypes.object.isRequired,
  settings: React.PropTypes.object.isRequired
}
