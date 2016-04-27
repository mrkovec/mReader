import React from 'react'
// import IpcRenderer from 'ipc-renderer'
import Path from 'path'
import Book from './../book'

import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'

// let snack = {}
// let actPage = 1
// let numPage = 0

export default class Ebook extends React.Component {
  constructor (props) {
    super(props)
    this.onBack = this.onBack.bind(this)
  }

  onBack () {
    // IpcRenderer.send('lastPage', {page: actPage, file: this.props.book.file})
    this.props.onAppChange({view: 'library'})
  }

  render () {
    let {book} = this.props
    let index = book.kap.map((k, i, arr) => {
      let kaptxt = `Chapter ${i + 1}`
      if (k.title) {
        if (i > 0) {
          if (strip(k.title) === strip(arr[i - 1].title)) {
            kaptxt = k.title
          }
        } else {
          kaptxt = k.title
        }
      }
      return (<li><a href={`#${i + 1}`} >{kaptxt}</a></li>)
    })
    let pages = book.kap.map((k, i) => {
      return (<Page key={i} src={`<h1>${k.title}</h1>${k.text}`} head={k.head} root={book.body[i]} pgn={i + 1} />)
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
        <ol>{index}</ol>
        {pages}
      </div>
    )
  }
}
Ebook.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  book: React.PropTypes.instanceOf(Book)

}

// // <div dangerouslySetInnerHTML={createIframe(this.props.src.text)} />
// function createIframe (src) {
//   // console.log(Path.normalize('file://' + src)) src="file://${encodeURI(src)}"
//   return {__html: `<iframe sandbox srcdoc="${src}" ></ifarme>`}
// }

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
    // this.ref.style = this.refParent.style
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

function strip (html) {
  let tmp = document.createElement('DIV')
  try {
    tmp.innerHTML = html
  } catch (err) {
    console.log(err)
  }
  return tmp.textContent || tmp.innerText || ''
}
// function rulesForCssText (styleContent) {
//   let doc = document.implementation.createHTMLDocument('')
//   let styleElement = document.createElement('style')
//   styleElement.textContent = styleContent
//   doc.body.appendChild(styleElement)
//   return styleElement.sheet.cssRules
// }
