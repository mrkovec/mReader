import React from 'react'
import IpcRenderer from 'ipc-renderer'

import Book from './../book'

import ListItem from 'material-ui/lib/lists/list-item'
import {darkBlack, lightBlack} from 'material-ui/lib/styles/colors'

export default class LibItem extends React.Component {
  constructor (props) {
    super(props)
    // this.state = {opened: false}
    this.onBookOpen = this.onBookOpen.bind(this)
  }

  onBookOpen () {
    // console.log(this.props.book)
    IpcRenderer.send('book', {type: 'open', msg: this.props.book})
  }

  render () {
    let {book} = this.props
    // let {issue, name, body} = book
    return (
      <ListItem primaryText={<p>{book.fname} <span style={{color: lightBlack}}>{book.sname}</span></p>}
        onClick={this.onBookOpen}
      />
    )
  }
}
LibItem.propTypes = {
  book: React.PropTypes.instanceOf(Book).isRequired
}
