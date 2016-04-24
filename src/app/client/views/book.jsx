import React from 'react'
import IpcRenderer from 'ipc-renderer'
/* import Bar from './bar'
import Lib from './lib'*/

import IconButton from 'material-ui/lib/icon-button'
import ActionHome from 'material-ui/lib/svg-icons/action/home'

let snack = {}
let actPage = 1
let numPage = 0

export class Book extends React.Component {
  constructor (props) {
    super(props)
    this.onBack = this.onBack.bind(this)
  }

  onBack () {
    IpcRenderer.send('lastPage', {page: actPage, file: this.props.book.file})
    this.props.onAppChange({view: 'library'})
  }

  componentDidMount () {
    let lp = this.props.book.info.lastPage == this.props.book.img.length ? 0 : this.props.book.info.lastPage
    setTimeout(function () {
      window.requestAnimationFrame(() => {
       location.hash = 'xxxx'
       location.hash =  lp
      })
    }, 0)
  }

  render () {
    snack = this.props.onSnackMessage

    let {book} = this.props

    numPage = book.img.length
    let pages = book.img.map((img, i) => {
      return (<Page key={i} src={img} pgn={i + 1} />)
    })
    return (
      <div className='bookContainer'>
        <div style={{position: 'fixed'}}>
          <IconButton tooltip='Library' iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
            <ActionHome />
          </IconButton>
        </div>
        {pages}
      </div>
    )
  }
}

class Page extends React.Component {
  render () {
    return (
      <div className='pageContainer' id={`${this.props.pgn}`} >
        <img src={encodeURI(this.props.src)} width={'100%'} alt={this.props.pgn} />
      </div>
    )
  }
}

export function lazyLoadImages () {
  let images = document.querySelectorAll('.bookContainer img')
  for (var i = 0; i < images.length; ++i) {
    let item = images[i]
    if (isElementInViewport(item)) {
      let page = item.attributes[2].nodeValue
      if (actPage !== page) {
        snack(`page ${page} of ${numPage}`)
        actPage = page
      }
      //  item.setAttribute("src",item.getAttribute("data-src"));
      // item.removeAttribute("data-src")
      // item.removeAttribute("height")
    }
  }
}
function isElementInViewport (el) {
  let rect = el.getBoundingClientRect()
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) & rect.top >= 0
  )
}
