import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Book from './../scripts/book'
import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'

export default class Comic extends React.Component {
  constructor (props) {
    super(props)
    this.onBack = this.onBack.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  onBack () {
    let poff = Math.floor(100 * (document.body.scrollTop / document.body.scrollHeight))
    IpcRenderer.send('readOffset', {offset: poff, file: this.props.book.file})
    this.props.onAppChange({view: 'library'})
  }
  componentDidMount () {
    let book = this.props.book
    setTimeout(function () {
      window.requestAnimationFrame(() => {
        document.body.scrollTop = Math.floor((book.info.readOffset / 100) * document.body.scrollHeight)
      })
    }, 0)
  }
  render () {
    let {book} = this.props
    console.log(book)
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
Comic.propTypes = {
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
