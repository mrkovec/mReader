import React from 'react'
import IpcRenderer from 'ipc-renderer'

import DropDownMenu from 'material-ui/DropDownMenu'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import Divider from 'material-ui/divider'
import TextField from 'material-ui/TextField'
import Download from 'material-ui/svg-icons/action/info-outline'
import Exit from 'material-ui/svg-icons/action/exit-to-app'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'

export default class Bar extends React.Component {
  constructor (props) {
    super(props)
    this.handleReadStateChange = this.handleReadStateChange.bind(this)
    this.handleBookTypeChange = this.handleBookTypeChange.bind(this)
    this.handleGroupByName = this.handleGroupByName.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSortBy = this.handleSortBy.bind(this)
    this.handleAbout = this.handleAbout.bind(this)
  }
  handleAbout () {
    this.props.onAppChange({view: 'about'})
  }
  handleSync () {
    IpcRenderer.send('library', {type: 'sync'})
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
  handleSearch (event) {
    if (event.target.value.length > 0) {
      this.props.onAppChange({search: event.target.value})
    } else {
      this.props.onAppChange({search: '@@@'})
    }
  }
  handleSortBy (what) {
    this.props.onAppChange({sortBy: what})
  }
  render () {
    let {readState, bookType, groupByName, sortBy} = this.props.settings
    return (
    <div>
      <Toolbar noGutter={true}>
         <ToolbarGroup float='left'>
           <IconMenu iconButtonElement={<IconButton touch={true} tooltip={'menu'}><MenuIcon /></IconButton>} >
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
              <MenuItem value={'comic'} primaryText='Comic' />
            </DropDownMenu>
            <TextField hintText='search library for...' onChange={this.handleSearch}/>
         </ToolbarGroup>
       <ToolbarGroup float='right'>
         <IconMenu iconButtonElement={<IconButton touch={true} tooltip={'more'}><MoreVertIcon /></IconButton>}>
           <MenuItem primaryText='Sync library' onTouchTap={this.handleSync} />
           <MenuItem primaryText='Add folder' onTouchTap={this.handleAdd} />
           <MenuItem primaryText='Clear library' />
           <Divider/>
           <MenuItem primaryText='Group by name' checked={groupByName} onTouchTap={this.handleGroupByName} insetChildren={true} />
           <Divider/>
           <MenuItem primaryText='Sort by name' checked={sortBy === 'name'} onTouchTap={() => this.handleSortBy('name')} insetChildren={true} />
           <MenuItem primaryText='Sort by date added' checked={sortBy === 'added'} onTouchTap={() => this.handleSortBy('added')} insetChildren={true} />
           <MenuItem primaryText='Sort by date read' checked={sortBy === 'read'} onTouchTap={() => this.handleSortBy('read')} insetChildren={true} />
         </IconMenu>
       </ToolbarGroup>
     </Toolbar>
  </div>
  ) }
}

Bar.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  settings: React.PropTypes.object.isRequired
}
