import React from 'react'
import Bar from './bar'
import Lib from './lib'
import {Book, lazyLoadImages} from './book'

import LinearProgress from 'material-ui/lib/linear-progress'
import Snackbar from 'material-ui/lib/snackbar'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {readState: 'unread',
                  bookType: 'all',
                  search: '',
                  // loading: false,
                  view: 'library',
                  groupByName: false
    }
    // this.handleBarChange = this.handleBarChange.bind(this)
    this.handleAppChange = this.handleAppChange.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.snackbarMessage = this.snackbarMessage.bind(this)

  }

  /*handleBarChange (changed) {
    let {filter, search} = changed
    if (filter) {
      this.setState({filter: filter})
    }
    if (search) {
      this.setState({search: search})
    }
  }*/

  handleAppChange (changed) {
    let {readState, bookType, search, view, groupByName} = changed
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
    if (groupByName !== null) {
      this.setState({groupByName: groupByName})
    }
  }
  snackbarMessage(msg) {

    if (this.snackRef) {
      console.log(msg)
      this.snackRef.handleMessage(msg)
    }
  }

  setLoading (state) {
    this.setState({loading: state})
  }

  render () {
    let {library, book, ...other} = this.props
    if (book != null & this.state.view === 'book') {
      window.addEventListener('resize', lazyLoadImages)
      window.addEventListener('scroll', lazyLoadImages)
      return (
        <div className='appContainer'>
          <Book book={book} onAppChange = {this.handleAppChange} onSnackMessage = {this.snackbarMessage}/>
          <Snack ref={(ref) => this.snackRef = ref} />
        </div>
      )
    }

    window.removeEventListener('resize', lazyLoadImages)
    window.removeEventListener('scroll', lazyLoadImages)
    let {readState, bookType} = this.state
    return (
      <div className='appContainer'>
        <Bar settings={this.state} onAppChange = {this.handleAppChange} ref={(ref) => this.barRef = ref} />

        <Lib library = {library} settings={this.state} />
        <Snack ref={(ref) => this.snackRef = ref} />
      </div>
    )
  }
}
// {this.state.loading ? <LinearProgress /> : ''}
class Snack extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      message: ''
    }
    this.lastInfo = ''
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    console.log('snack constructor')
  }

  handleRequestClose () {
    this.setState({
      open: false
    })
  }
  handleMessage (msg) {
    console.log('handleMessage ' + msg)
    if (this.state.open) {
      setTimeout(() => {
        this.setState({
          message: msg
        })
      }, 1000)
    } else {
      this.setState({
        open: true,
        message: msg
      })
    }
  }

  render () {
    return (
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
    )
  }
}
