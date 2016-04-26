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
    let pages = book.kap.map((k, i) => {
      return (<Page key={i} src={`<h1>${k.title}</h1>${k.text}`} pgn={i + 1} />)
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
    this.ref.innerHTML = this.props.src
  }
  render () {
    return (
      <div className='pageContainer' id={`${this.props.pgn}`} >
        <div ref={(ref) => this.ref = ref} />
      </div>
    )
  }
}
Page.propTypes = {
  pgn: React.PropTypes.number.isRequired,
  src: React.PropTypes.string.isRequired
}

// function strip (html) {
//   let tmp = document.createElement('DIV')
//   try {
//     tmp.innerHTML = html
//   } catch (err) {
//     console.log(err)
//   }
//   return tmp.textContent || tmp.innerText || ''
// }
