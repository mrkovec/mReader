import React from 'react'
import Bar from './bar'
import Lib from './lib'
import Ebook from './ebook'
import Comic from './comic'

import Book from './../scripts/book'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {readState: 'unread',
                  bookType: 'all',
                  search: '',
                  view: 'library',
                  groupByName: false
    }
    this.handleAppChange = this.handleAppChange.bind(this)
  }

  handleAppChange (changed) {
    let {readState, bookType, search, view, groupByName} = changed
    if (readState) {
      this.setState({readState: readState})
    }
    if (bookType) {
      this.setState({bookType: bookType})
    }
    if (search) {
      this.setState({search: search})
    }
    if (view) {
      this.setState({view: view})
    }
    if (groupByName !== null) {
      this.setState({groupByName: groupByName})
    }
  }

  render () {
    let {library, book} = this.props

    if (book != null & this.state.view === 'book') {
      switch (book.type) {
        case 'ebook':
          return (
            <div className='appContainer'>
              <Ebook book={book} onAppChange = {this.handleAppChange}/>
            </div>
          )
        case 'comic':
          return (
            <div className='appContainer'>
              <Comic book={book} onAppChange = {this.handleAppChange}/>
            </div>
          )
        default:
      }
    }
    return (
      <div className='appContainer'>
        <Bar settings={this.state} onAppChange = {this.handleAppChange} />
        <Lib library = {library} settings={this.state} />
      </div>
    )
  }
}

App.propTypes = {
  library: React.PropTypes.array.isRequired,
  book: React.PropTypes.instanceOf(Book)
}
