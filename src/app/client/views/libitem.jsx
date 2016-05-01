import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Book from './../scripts/book'
import {GetPDFinfo} from './pdf'
import ListItem from 'material-ui/lib/lists/list-item'
import LinearProgress from 'material-ui/lib/linear-progress'
import {darkBlack, lightBlack} from 'material-ui/lib/styles/colors'
import Avatar from 'material-ui/lib/avatar'

export default class LibItem extends React.Component {
  constructor (props) {
    super(props)
    this.onBookOpen = this.onBookOpen.bind(this)
    this.renderBook = this.renderBook.bind(this)
  }

  onBookOpen () {
    IpcRenderer.send('book', {type: 'open', msg: this.props.book})
  }
  renderBook (book, i) {
    if (book.type === 'pdf' & (!book.author)) {
      GetPDFinfo(book).then((b) => {
        book.author = 'unknown'
        if (b.info.Author) {
          book.author = b.info.Author
        }
        if (b.info.Title) {
          book.name = b.info.Title
        }
        console.log(book)
        IpcRenderer.send('library', {type: 'update', book: book})
      }).catch((err) => {
        console.log(err)
      })
    }
    if (book.nested) {
      let sub = book.nested.map((b, i) => {
        return this.renderBook(b, i)
      })
      return (
        <div>
          <ListItem primaryText={<p>{book.fname} <span style={{color: lightBlack}}>{book.sname}</span></p>}
          onClick={this.onBookOpen} nestedItems={sub}/>
        </div>
      )
    }
    return (
      <div key={i ? i : null}>
        <ListItem primaryText={<p>{book.fname} <span style={{color: lightBlack}}>{book.sname}</span></p>} onClick={this.onBookOpen} />
        {book.info ? <LinearProgress mode='determinate' min={0} max ={100} value={book.info.readOffset} /> : null}
      </div>
    )
  }

  render () {
    let {book} = this.props
    return this.renderBook(book)
  }
}
LibItem.propTypes = {
  book: React.PropTypes.instanceOf(Book).isRequired
}
