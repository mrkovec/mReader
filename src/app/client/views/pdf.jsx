import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Book from './../scripts/book'
import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'
import {PDFJS} from 'pdfjs-dist'

export default class Pdf extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pdf: null
    }
    this.onBack = this.onBack.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.setPDF = this.setPDF.bind(this)
  }
  onBack () {
    let poff = Math.floor(100 * (document.body.scrollTop / document.body.scrollHeight))
    IpcRenderer.send('readOffset', {offset: poff, file: this.props.book.file})
    this.props.onAppChange({view: 'library'})
  }
  componentDidMount () {
    console.log('he')
    // let book = this.book
    setTimeout(function () {
      window.requestAnimationFrame(() => {
        document.body.scrollTop = Math.floor((50 / 100) * document.body.scrollHeight)
      })
    }, 1000)
  }
  setPDF () {
    let book = this
    PDFJS.workerSrc = 'c:/mmr/rozne/electron/worspace/reader/node_modules/pdfjs-dist/build/pdf.worker.js'
    PDFJS.getDocument(this.props.book.fullPath).then(function (pdf) {
      book.setState({pdf: pdf})
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
          <Page book={this.state.pdf} page={i} />
          </div>
      )
    }
    return (
      <div className='bookContainer'>
        <div style={{position: 'fixed', left: '5px'}}>
          <IconButton tooltip='Library' iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
            <ActionHome />
          </IconButton>
        </div>
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
  componentDidMount () {
    let pdfpage = this.props.page
    this.props.book.getPage(this.props.page).then(function (page) {
      let viewport = page.getViewport(1)
      let scale = window.innerWidth / viewport.width
      viewport = page.getViewport(scale)
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
