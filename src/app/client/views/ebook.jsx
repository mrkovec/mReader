import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Path from 'path'
import Book from './../scripts/book'
import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'

export default class Ebook extends React.Component {
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
    let book = this.book
    setTimeout(function () {
      window.requestAnimationFrame(() => {
        document.body.scrollTop = Math.floor((book.info.readOffset / 100) * document.body.scrollHeight)
      })
    }, 0)
  }
  render () {
    let {book} = this.props
    this.book = book
    let index = book.kap.map((k, i, arr) => {
      return (<li><a href={`#${i + 1}`} >{k.title}</a></li>)
    })
    let pages = book.kap.map((k, i) => {
      return (<Page key={i} src={`${k.text}`} head={k.head} root={book.body[i]} pgn={i + 1} />)
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
        <h1>{book.fname}</h1>
        <h2>{book.sname}</h2>
        <div><ol>{index}</ol></div>
        {pages}
      </div>
    )
  }
}
Ebook.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  book: React.PropTypes.instanceOf(Book)

}

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount () {
    // let tmp = document.createElement('DIV')
    // try {
    //   tmp.innerHTML = this.props.head
    // } catch (err) {
    //   console.log(err)
    // }
    // let css = tmp.getElementsByTagName('link')
    // for (let i = 0; i < css.length; ++i) {
    //   if (css[i].rel === 'stylesheet') {
    //     console.log(css[i])
    //   }
    // }
    // tmp.getElementsByTagName("img").forEach((img) => {
    //   if(img) {
    //     console.log(img) //[0].baseURI)
    //   }
    // })
    this.ref.style.fontFamily = 'Roboto, sans-serif'
    this.ref.innerHTML = this.props.src
    let images = this.ref.getElementsByTagName('img')
    for (let i = 0; i < images.length; ++i) {
      images[i].setAttribute('src', Path.join(Path.dirname(this.props.root), images[i].getAttribute('src')))
      images[i].setAttribute('style', 'max-width: 100%; margin: 0 auto; display: block')
    }
    images = this.ref.getElementsByTagName('image')
    for (let i = 0; i < images.length; ++i) {
      images[i].setAttribute('xlink:href', Path.join(Path.dirname(this.props.root), images[i].getAttribute('xlink:href')))
      images[i].setAttribute('style', 'max-width: 100%; margin: 0 auto; display: block')
    }
  }

  render () {
    // window.addEventListener('scroll', cekPos)
    return (
      <div className='pageContainer' id={`${this.props.pgn}`} ref={(ref) => this.refParent = ref}>
        <div ref={(ref) => this.ref = ref} />
      </div>
    )
  }
}
Page.propTypes = {
  pgn: React.PropTypes.number.isRequired,
  src: React.PropTypes.string.isRequired,
  root: React.PropTypes.string.isRequired
}

// function cekPos () {
//   let body = document.body
//   let html = document.documentElement
//
//   // console.log('body.scrollHeight ' + body.scrollHeight)
//   // console.log('window.innerHeight ' + window.innerHeight)
//   // console.log('body.scrollTop ' + body.scrollTop)
//   console.log('body.scrollBottom ' + (body.scrollTop + window.innerHeight))
//   // console.log('html.clientHeight ' + html.clientHeight)
//   console.log('window.innerHeight ' + window.innerHeight)
// }

// function strip (html) {
//   let tmp = document.createElement('DIV')
//   try {
//     tmp.innerHTML = html
//   } catch (err) {
//     console.log(err)
//   }
//   return tmp.textContent || tmp.innerText || ''
// }
// function rulesForCssText (styleContent) {
//   let doc = document.implementation.createHTMLDocument('')
//   let styleElement = document.createElement('style')
//   styleElement.textContent = styleContent
//   doc.body.appendChild(styleElement)
//   return styleElement.sheet.cssRules
// }
