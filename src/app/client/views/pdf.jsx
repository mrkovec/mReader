import React from 'react'
import IpcRenderer from 'ipc-renderer'
import WebFrame from 'web-frame'
import Book from './../scripts/book'
// import {Lib} from './../main'
import IconButton from 'material-ui/IconButton/IconButton'
import ActionHome from 'material-ui/svg-icons/action/home'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import ArrowDropLeft from 'material-ui/svg-icons/navigation/chevron-left'

import {PDFJS} from 'pdfjs-dist'

export default class Pdf extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pdf: null,
      zoom: 100
    }
    this.onBack = this.onBack.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.setPDF = this.setPDF.bind(this)
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
    }, 1000)
  }
  setPDF () {
    let pdfbook = this
    // let book = this.props.book
    PDFJS.workerSrc = 'c:/mmr/rozne/electron/worspace/reader/node_modules/pdfjs-dist/build/pdf.worker.js'
    PDFJS.getDocument(this.props.book.fullPath).then(function (pdf) {
      pdfbook.setState({pdf: pdf})
    }).catch((err) => {
      console.log(err)
    })
  }
  render () {
    if (!this.state.pdf) {
      this.setPDF()
      return null
    }
    let pages = []
    for (let i = 1; i <= this.state.pdf.numPages; i++) {
      pages = pages.concat(
        <div key={i} className='itemContainer'>
          <Page book={this.state.pdf} page={i} zoom={this.state.zoom}/>
          </div>
      )
    }
    return (
      <div className='bookContainer'>
      <header>
        <section style={{position: 'fixed', left: '5px'}}>
          <IconButton tooltip='Library' iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
            <ActionHome />
          </IconButton>
        </section>
        <section style={{position: 'fixed', right: '5px'}}>
          <IconMenu
            iconButtonElement={<IconButton iconStyle={{opacity: '0.5'}}><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText='zoom' leftIcon={<ArrowDropLeft />} insetChildren={true}
            menuItems={[
              <div>
                <MenuItem key={1} primaryText='in' onTouchTap={() => { this.zoom(1) }} />
                <MenuItem key={2} primaryText='out' onTouchTap={() => { this.zoom(-1) }} />
                <MenuItem key={3} primaryText='reset' onTouchTap={() => { this.zoom(0) }}/>
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
Pdf.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  book: React.PropTypes.instanceOf(Book)
}

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    // console.log(nextProps)
    this.componentDidMount()
   }
  componentDidMount () {
    let zoom = this.props.zoom
    let pdfpage = this.props.page
    this.props.book.getPage(this.props.page).then(function (page) {
      let viewport = page.getViewport(1)
      let scale = window.innerWidth / viewport.width
      console.log(scale * zoom / 100)
      // viewport = page.getViewport(scale * zoom / 100)
      viewport = page.getViewport(0.2)
      let canvas = document.getElementById(`canvas${pdfpage}`)
      let context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      let renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      page.render(renderContext)
    })
  }
  render () {
    return (
      <div className='pageContainer'>
        <canvas id={`canvas${this.props.page}`} ></canvas>
      </div>
    )
  }
}
Page.propTypes = {
  page: React.PropTypes.number.isRequired,
  book: React.PropTypes.object.isRequired
}

export function GetPDFinfo (book) {
  PDFJS.workerSrc = 'c:/mmr/rozne/electron/worspace/reader/node_modules/pdfjs-dist/build/pdf.worker.js'
  return PDFJS.getDocument(book.fullPath).then(function (pdf) {
    return pdf.getMetadata()
  })
}
