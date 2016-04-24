import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Path from 'path'

// import AppBar from 'material-ui/lib/app-bar'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
// import RaisedButton from 'material-ui/lib/raised-button'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
// import FontIcon from 'material-ui/lib/font-icon'
// import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more'

import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from 'material-ui/lib/icon-button'
import Divider from 'material-ui/lib/divider'

import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
// import RaisedButton from 'material-ui/lib/raised-button'

import Download from 'material-ui/lib/svg-icons/action/info-outline'
import Exit from 'material-ui/lib/svg-icons/action/exit-to-app'
// import ArrowDropRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import Subheader from 'material-ui/lib/Subheader'


const dialog = require('electron').remote.dialog

export default class Bar extends React.Component {
  constructor (props) {
    super(props)
    this.handleAbout = this.handleAbout.bind(this)
    // this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleReadStateChange = this.handleReadStateChange.bind(this)
    this.handleBookTypeChange = this.handleBookTypeChange.bind(this)
    this.handleGroupByName = this.handleGroupByName.bind(this)
  }

  handleAbout () {
    const aboutActions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ]
    if (this.dialogRef !== null) {
      this.dialogRef.handleOpen(aboutActions)
    }
  }

  // handleFilterChange (e, index, value) {
  //   this.props.onBarChange({filter: value})
  // }

  handleAdd () {
    dialog.showOpenDialog({properties: ['openDirectory']}, (path) => {
      let a = new Promise((resolve) => {
        let lib = JSON.parse(localStorage.getItem('library'))
        if (!lib) {
          lib = []
        }
        lib = lib.map((book) => {
          return {file: Path.join(book.libpath, book.relpath, book.file), img: book.img}
        })
        resolve(lib)
      })
      a.then((lib) => {
        // IpcRenderer.send('library', {type: 'add', msg: {path: path[0], exbook: lib}})
        IpcRenderer.send('library', {type: 'add', msg: {path: path[0]}})
      })
    })
  }

  handleSync () {
    let a = new Promise((resolve) => {
      let lib = JSON.parse(localStorage.getItem('library'))
      if (!lib) {
        lib = []
      }
      lib = lib.map((book) => {
        return {file: Path.join(book.libpath, book.relpath, book.file), img: book.img}
      })
      resolve(lib)
    })
    a.then((lib) => {
      IpcRenderer.send('library', {type: 'sync', msg: {oldlib: lib}})
    })
  }

  handleReadStateChange (e, index, value) {
    this.props.onAppChange({readState: value})
  }

  handleBookTypeChange (e, index, value) {
    this.props.onAppChange({bookType: value})
  }
  handleGroupByName () {
    this.props.onAppChange({groupByName: !this.props.settings.groupByName})
  }

  render () {
    let {readState, bookType, search, groupByName} = this.props.settings
    return (
    <div>
      <DialogAbout ref={(ref) => this.dialogRef = ref} />
      <Toolbar>
         <ToolbarGroup firstChild={true} float='left'>
           <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>} >
             <MenuItem primaryText='About' leftIcon={<Download />} onTouchTap={this.handleAbout} />
             <Divider />
             <MenuItem value='Del' primaryText='Quit' leftIcon={<Exit />} />
            </IconMenu>
            <ToolbarTitle text='Library' />

           <DropDownMenu value={readState} onChange={this.handleReadStateChange}>
             <MenuItem value={'all'} primaryText='All' />
             <MenuItem value={'progress'} primaryText='In progress' />
             <MenuItem value={'unread'} primaryText='Unread' />
             <MenuItem value={'read'} primaryText='Read' />
           </DropDownMenu>
           <DropDownMenu value={bookType} onChange={this.handleBookTypeChange}>
             <MenuItem value={'all'} primaryText='All' />
             <MenuItem value={'ebook'} primaryText='Books' />
             <MenuItem value={'comics'} primaryText='Comics' />
           </DropDownMenu>
         </ToolbarGroup>

       <ToolbarGroup float='right'>
         <IconMenu
           iconButtonElement={
             <IconButton touch={true}>
               <MoreVertIcon />
             </IconButton>
           }
         >
           <MenuItem primaryText='Sync' onTouchTap={this.handleSync} insetChildren={true} />
           <MenuItem primaryText='Add folder' onTouchTap={this.handleAdd} insetChildren={true} />
           <MenuItem primaryText='Clear' insetChildren={true} />
           <MenuItem primaryText='Name' checked={groupByName} onTouchTap={this.handleGroupByName} insetChildren={true} />
           <MenuItem primaryText='Folder' onTouchTap={this.handleSync} insetChildren={true} />
         </IconMenu>
         <Divider />
         <ToolbarSeparator />
       </ToolbarGroup>
     </Toolbar>
  </div>
  ) }
}


class DialogAbout extends React.Component {
  constructor (props) {
    super(props)
    console.log('DialogAbout')
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = {
      open: false
    }
  }

  handleOpen (actions) {
    this.setState({text: process.versions.node})
    this.setState({actions: actions})
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  render () {
    return (
      <div>
         <Dialog
          title={this.props.title}
          actions={this.state.actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.state.text}
        </Dialog>
      </div>
    )
  }
}
