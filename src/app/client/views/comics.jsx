import React from 'react'
import Book from './../book'

import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'

export default class Comics extends React.Component {
  constructor (props) {
    super(props)
    this.onBack = this.onBack.bind(this)
  }
  onBack () {
    this.props.onAppChange({view: 'library'})
  }
  render () {
    let {book} = this.props
    let pages = book.body.map((k, i) => {
      return (<Page key={i} src={`${k}`} pgn={i + 1} />)
    })
    return (
      <div className='bookContainer'>
        <div style={{position: 'fixed', left: '5px'}}>
          <IconButton tooltip='Library' iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
            <ActionHome />
          </IconButton>
        </div>
        <div style={{position: 'fixed', right: '5px'}}>
          <IconButton tooltip='Library' iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
            <ActionHome />
          </IconButton>
        </div>
        {pages}
      </div>
    )
  }
}
Comics.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  book: React.PropTypes.instanceOf(Book)

}

class Page extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className='pageContainer' id={`${this.props.pgn}`} >
        <img src={this.props.src} style={{maxWidth: '100%', margin: '0 auto', display: 'block'}}/>
      </div>
    )
  }
}
Page.propTypes = {
  pgn: React.PropTypes.number.isRequired,
  src: React.PropTypes.string.isRequired
}
