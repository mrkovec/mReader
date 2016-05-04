import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Path from 'path'
// import WebFrame from 'web-frame'
import Book from './../scripts/book'

import IconButton from 'material-ui/IconButton/IconButton'
import ActionHome from 'material-ui/svg-icons/action/home'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
// import Divider from 'material-ui/divider'
import ArrowDropLeft from 'material-ui/svg-icons/navigation/chevron-left'

export default class Ebook extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      font: 'Roboto, sans-serif',
      zoom: 100
    }
    this.onBack = this.onBack.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.zoom = this.zoom.bind(this)
    this.font = this.font.bind(this)
  }
  font (f) {
    this.setState({font: f})
  }
  zoom (z) {
    if (z === 0) {
      // WebFrame.setZoomLevel(0)
      this.setState({zoom: 100})
    } else {
      this.setState({zoom: this.state.zoom + z * this.state.zoom})
      // WebFrame.setZoomLevel(WebFrame.getZoomLevel() + z)
    }
  }
  onBack () {
    this.props.book.kap = null
    this.props.book.info.readOffset = 100.0 * (document.body.scrollTop / document.body.scrollHeight)
    this.props.book.info.zoom = this.state.zoom
    this.props.book.info.font = this.state.font
    this.props.book.info.read = new Date()
    IpcRenderer.send('library', {type: 'update', book: this.props.book})
    this.props.onAppChange({view: 'library'})
  }
  componentDidMount () {
    let book = this.book
    this.setState({zoom: book.info.zoom ? book.info.zoom : 100, font: book.info.font ? book.info.font : 'Roboto, sans-serif'})
    setTimeout(function () {
      window.requestAnimationFrame(() => {
        document.body.scrollTop = Math.floor((book.info.readOffset / 100) * document.body.scrollHeight)
      })
    }, 0)

    // window.addEventListener('resize', function (event) {
    //   // console.log(book.info.readOffset)
    //   // console.log(document.body.scrollHeight)
    //   // console.log(document.body.offsetHeight)
    //
    //   // console.log(document.documentElement.clientHeight)
    //   // console.log(document.documentElement.offsetHeight)
    //
    //   // // console.log((book.info.readOffset / 100.0) * document.body.scrollHeight)
    //   setTimeout(function () {
    //     window.requestAnimationFrame(() => {
    //       document.body.scrollTop = Math.floor((book.info.readOffset / 100) * document.body.scrollHeight)
    //     })
    //   }, 0)
    // })
  }
  render () {
    let {book} = this.props
    this.book = book
    // let index = book.kap.map((k, i, arr) => {
    //   return (<li><a href={`#${i + 1}`} >{k.title}</a></li>)
    // })
    // console.log(this.state)
    let pages = book.kap.map((k, i) => {
      return (<Page key={i} src={`${k.text}`} head={k.head} root={book.body[i]} pgn={i + 1}
        font={this.state.font} zoom={this.state.zoom}/>)
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
                 <MenuItem primaryText='reset' onTouchTap={() => { this.zoom(0) }} />
                 </div>
                ]} />
                <MenuItem primaryText='font' leftIcon={<ArrowDropLeft />} insetChildren={true}
                  menuItems={[
                    <div>
                   <MenuItem insetChildren={true} checked={this.state.font === 'Roboto, sans-serif'} primaryText='default' onTouchTap={() => { this.font('Roboto, sans-serif') }} />
                   <MenuItem insetChildren={true} checked={this.state.font === 'Arial, Helvetica, sans-serif'} primaryText='arial' onTouchTap={() => { this.font('Arial, Helvetica, sans-serif') }} />
                   <MenuItem insetChildren={true} checked={this.state.font === 'Times New Roman, Times, serif'} primaryText='times new roman' onTouchTap={() => { this.font('Times New Roman, Times, serif') }}/>
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
Ebook.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  book: React.PropTypes.instanceOf(Book)

}
// <header>
// <section style={{position: 'fixed', left: '5px'}}>
//   <IconButton tooltip='Library' iconStyle={{opacity: '0.5'}} onTouchTap={this.onBack}>
//     <ActionHome />
//   </IconButton>
// </section>

// <div key={1} style={{position: 'fixed', right: '5px'}}>
// </div>
//
// <h1>{book.fname}</h1>
// <h2>{book.sname}</h2>
// <div key={3}><ol>{index}</ol></div>
// </header>
class Page extends React.Component {
  constructor (props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  componentWillUpdate (nextProps) {
    this.ref.style.fontFamily = nextProps.font
    this.ref.style.fontSize = `${nextProps.zoom}%`
  }
  componentDidMount () {
    this.ref.style.fontFamily = this.props.font
    this.ref.style.fontSize = `${this.props.zoom}%`
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
      <article className='pageContainer' id={`${this.props.pgn}`} ref={(ref) => this.ref = ref}>
      </article>
    )
  }
}
Page.propTypes = {
  font: React.PropTypes.string.isRequired,
  pgn: React.PropTypes.number.isRequired,
  src: React.PropTypes.string.isRequired,
  root: React.PropTypes.string.isRequired
}

// function cekPos () {
//   let body = document.body
//   let html = document.documentElement
//
//   // // console.log('body.scrollHeight ' + body.scrollHeight)
//   // // console.log('window.innerHeight ' + window.innerHeight)
//   // // console.log('body.scrollTop ' + body.scrollTop)
//   // console.log('body.scrollBottom ' + (body.scrollTop + window.innerHeight))
//   // // console.log('html.clientHeight ' + html.clientHeight)
//   // console.log('window.innerHeight ' + window.innerHeight)
// }

// function strip (html) {
//   let tmp = document.createElement('DIV')
//   try {
//     tmp.innerHTML = html
//   } catch (err) {
//     // console.log(err)
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
//


// <IconMenu
//    iconButtonElement={<IconButton iconStyle={{opacity: '0.5'}}><MoreVertIcon /></IconButton>}
//    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
//    targetOrigin={{horizontal: 'right', vertical: 'top'}}
//  >
//  <MenuItem primaryText='zoom' leftIcon={<ArrowDropLeft />} insetChildren={true} menuItems={[
//    <div key={1}>
//    <MenuItem key={1} primaryText='in' onTouchTap={() => { this.zoom(1) }} />
//    <MenuItem key={2} primaryText='out' onTouchTap={() => { this.zoom(-1) }} />
//    <MenuItem key={3} primaryText='reset' onTouchTap={() => { this.zoom(0) }}/>
//    </div>
// ]} />
//    <MenuItem primaryText='font' leftIcon={<ArrowDropLeft />} insetChildren={true} menuItems={[
//      <div key={2}>
//      <MenuItem key={1} value={'default'} primaryText='default' />
//      <MenuItem key={2} value={'arial'} primaryText='arial' />
//      <MenuItem key={3} value={'times'} primaryText='times new roman' />
//      </div>
//    ]} />
//  </IconMenu>
