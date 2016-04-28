import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Book from './../scripts/book'
import ListItem from 'material-ui/lib/lists/list-item'
import LinearProgress from 'material-ui/lib/linear-progress'
import {darkBlack, lightBlack} from 'material-ui/lib/styles/colors'

export default class LibItem extends React.Component {
  constructor (props) {
    super(props)
    this.onBookOpen = this.onBookOpen.bind(this)
  }

  onBookOpen () {
    IpcRenderer.send('book', {type: 'open', msg: this.props.book})
  }

  render () {
    let {book} = this.props
    console.log(book)
    return (
      <div>
        <ListItem primaryText={<p>{book.fname} <span style={{color: lightBlack}}>{book.sname}</span></p>} onClick={this.onBookOpen} />
        <LinearProgress mode='determinate' min={0} max ={100} value={book.info.readOffset} />
      </div>
    )
  }
}
LibItem.propTypes = {
  book: React.PropTypes.instanceOf(Book).isRequired
}
