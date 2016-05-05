import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Book from './../scripts/book'
import {GetPDFinfo} from './pdf'
import {ListItem} from 'material-ui/List'
import LinearProgress from 'material-ui/LinearProgress'
import {darkBlack, lightBlack} from 'material-ui/styles/colors'
// import Avatar from 'material-ui/avatar'
import FolderIcon from 'material-ui/svg-icons/file/folder'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'

export default class LibItem extends React.Component {
  constructor (props) {
    super(props)
    this.onBookOpen = this.onBookOpen.bind(this)
    this.renderBook = this.renderBook.bind(this)
    this.markAs = this.markAs.bind(this)
  }
  markAs (as, i) {
    let msg = {}
    if (i === undefined) {
      msg = this.props.book
    } else {
      msg = this.props.book.nested[i]
    }
    msg.info.readOffset = 0
    if (as) {
      msg.info.readOffset = 100
      IpcRenderer.send('book', {type: 'clear', msg: msg})
    }
    IpcRenderer.send('library', {type: 'update', book: msg})
  }
  onBookOpen (i) {
    let msg = {}
    if (i === undefined) {
      msg = this.props.book
    } else {
      msg = this.props.book.nested[i]
    }
    IpcRenderer.send('book', {type: 'open', msg: msg})
  }
  renderBook (book, i) {
    // // console.log('renderbook')
    // // console.log(book)
    if (book.type === 'pdf' & (!book.author) & (!book.nested)) {
      GetPDFinfo(book).then((b) => {
        book.author = 'unknown'
        if (b.info.Author) {
          book.author = b.info.Author
        }
        if (b.info.Title) {
          book.name = b.info.Title
        }
        // // console.log(book)
        IpcRenderer.send('library', {type: 'update', book: book})
      }).catch((err) => {
        // console.log(err)
      })
    }
    if (book.nested) {
      let sub = book.nested.map((b, i) => {
        return this.renderBook(b, i)
      })
      return (
        <div style={{borderBottom: 'medium solid #eeeeee'}}>
          <ListItem leftIcon={<FolderIcon/>} primaryText={<p>{book.printname} <span style={{color: lightBlack}}>{book.printauthor}</span></p>} nestedItems={sub}/>
        </div>
      )
    }
    return (
      <div key={i ? i : null} style={{borderBottom: 'medium solid #eeeeee'}}>
        <ListItem leftIcon={book.icon} primaryText={<p>{book.printname} <span style={{color: lightBlack}}>{book.printauthor}</span></p>} onTouchTap={() => this.onBookOpen(i)}
        rightIconButton={
          <IconMenu
            iconButtonElement={<IconButton touch={true}><MoreVertIcon /></IconButton>}
          >
            <MenuItem primaryText='mark as read' onTouchTap={() => { this.markAs(1, i) }} />
            <MenuItem primaryText='mark as unread' onTouchTap={() => { this.markAs(0, i) }} />
          </IconMenu>
        }
        />
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
