import React from 'react'
import Bar from './bar'
import Lib from './lib'
import Ebook from './ebook'
import Comic from './comic'
import Pdf from './pdf'
import About from './about'
import Book from './../scripts/book'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'
// import ColorManipulator from 'material-ui/utils/colorManipulator'
// let ColorManipulator = require('material-ui/utils/colorManipulator')
// import {darkBlack, fullBlack, white, grey500, grey300, cyan500} from 'material-ui/styles/colors'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {readState: 'unread',
                  bookType: 'all',
                  search: '@@@',
                  view: 'library',
                  groupByName: true,
                  sortBy: 'name'
    }
    this.handleAppChange = this.handleAppChange.bind(this)
  }
  getChildContext () {
    // return {
    //   muiTheme: getMuiTheme({
    //     palette: {
    //       primary1Color: '#558B2F',
    //       primary2Color: '#845998',
    //       primary3Color: '#682DBE',
    //       accent1Color: '#2DBE4F',
    //       accent2Color: '#B2F1C0',
    //       accent3Color: grey500,
    //       textColor: darkBlack,
    //       alternateTextColor: white,
    //       canvasColor: white,
    //       borderColor: grey300,
    //       disabledColor: ColorManipulator.fade(darkBlack, 0.3),
    //       pickerHeaderColor: cyan500,
    //       clockCircleColor: ColorManipulator.fade(darkBlack, 0.07),
    //       shadowColor: fullBlack
    //     }
    //   })
    // }
    return {
      muiTheme: getMuiTheme(baseTheme)
    }
  }

  handleAppChange (changed) {
    let {readState, bookType, search, view, groupByName, sortBy} = changed
    if (readState) {
      this.setState({readState: readState})
    }
    if (bookType) {
      this.setState({bookType: bookType})
    }
    if (search) {
      this.setState({search: search})
    }
    if (view) {
      this.setState({view: view})
    }
    if (groupByName !== undefined) {
      this.setState({groupByName: groupByName})
    }
    if (sortBy) {
      this.setState({sortBy: sortBy})
    }
  }

  render () {
    let {library, book} = this.props

    if (book != null & this.state.view === 'book') {
      switch (book.type) {
        case 'ebook':
          return (
            <div className='appContainer'>
              <Ebook book={book} onAppChange = {this.handleAppChange}/>
            </div>
          )
        case 'pdf':
          return (
            <div className='appContainer'>
              <Pdf book={book} onAppChange = {this.handleAppChange}/>
            </div>
          )
        case 'comic':
          return (
            <div className='appContainer'>
              <Comic book={book} onAppChange = {this.handleAppChange}/>
            </div>
          )
        default:
      }
    } else if (this.state.view === 'about') {
      return (
        <div className='appContainer'>
          <About onAppChange = {this.handleAppChange}/>
        </div>
      )
    }
    return (
      <div className='appContainer'>
        <Paper>
          <header><Bar settings={this.state} onAppChange = {this.handleAppChange} /></header>
          <Lib library = {library} settings={this.state} />
        </Paper>
      </div>
    )
  }
}
App.propTypes = {
  library: React.PropTypes.array.isRequired,
  book: React.PropTypes.instanceOf(Book)
}
App.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired
}
