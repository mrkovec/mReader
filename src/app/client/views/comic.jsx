import React from 'react'
import {ipcRenderer as IpcRenderer} from 'electron'
import {WebFrame} from 'electron'
import Book from './../scripts/book'
import IconButton from 'material-ui/IconButton/IconButton'
import ActionHome from 'material-ui/svg-icons/action/home'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import ArrowDropLeft from 'material-ui/svg-icons/navigation/chevron-left'

export default class Comic extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: 100
    }
    this.onBack = this.onBack.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.zoom = this.zoom.bind(this)
  }
  zoom (z) {
    if (z === 0) {
      this.setState({zoom: 100})
    } else {
      this.setState({zoom: this.state.zoom + z * this.state.zoom})
    }
  }
  onBack () {
    this.props.book.info.readOffset = 100.0 * (document.body.scrollTop / document.body.scrollHeight)
    this.props.book.info.zoom = this.state.zoom
    this.props.book.info.read = new Date()
    // console.log(this.props.book.info.read)
    IpcRenderer.send('library', {type: 'update', book: this.props.book})
    this.props.onAppChange({view: 'library'})
  }
  componentDidMount () {
    let book = this.props.book
    this.setState({zoom: book.info.zoom ? book.info.zoom: 100})
    setTimeout(function () {
      window.requestAnimationFrame(() => {
        document.body.scrollTop = Math.floor((book.info.readOffset / 100) * document.body.scrollHeight)
      })
    }, 0)
  }
  render () {
    let {book} = this.props
    // // console.log(book)
    let pages = book.body.map((k, i) => {
      return (<Page key={i} src={`${k}`} pgn={i + 1} zoom={this.state.zoom}/>)
    })
    return (
      <div className='bookContainer'>
        <header>
          <section style={{position: 'fixed', left: '5px'}}>
            <IconButton tooltip='library' touch={true} iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
              <ActionHome />
            </IconButton>
          </section>
          <section style={{position: 'fixed', right: '5px'}}>
            <IconMenu
              iconButtonElement={<IconButton iconStyle={{opacity: '0.5'}} touch={true} tooltip={'more'}><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText='zoom' leftIcon={<ArrowDropLeft />} insetChildren={true}
              menuItems={[
                <div>
                  <MenuItem primaryText='in' onTouchTap={() => { this.zoom(0.1) }} />
                  <MenuItem primaryText='out' onTouchTap={() => { this.zoom(-0.1) }} />
                  <MenuItem primaryText='reset' onTouchTap={() => { this.zoom(0) }}/>
                </div>
              ]} />
            </IconMenu>
          </section>
        </header>
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
    // if (this.props.zoom === 0) {
      return (
        <div className='pageContainer' id={`${this.props.pgn}`} >
          <img src={this.props.src} style={{maxWidth: `${this.props.zoom}%`, margin: '0 auto', display: 'block'}}/>
        </div>
      )
    // }
    // return (
    //   <div className='pageContainer' id={`${this.props.pgn}`} >
    //     <img src={this.props.src} style={{width: `${100 + this.props.zoom * 10}%`, height: `${100 + this.props.zoom * 10}%`, margin: '0 auto', display: 'block'}}/>
    //   </div>
    // )
  }
}
Page.propTypes = {
  pgn: React.PropTypes.number.isRequired,
  src: React.PropTypes.string.isRequired
}
