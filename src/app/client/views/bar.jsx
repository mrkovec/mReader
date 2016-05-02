import React from 'react'
import IpcRenderer from 'ipc-renderer'

import DropDownMenu from 'material-ui/DropDownMenu'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import Divider from 'material-ui/divider'
import Download from 'material-ui/svg-icons/action/info-outline'
import Exit from 'material-ui/svg-icons/action/exit-to-app'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

export default class Bar extends React.Component {
  constructor (props) {
    super(props)
    this.handleReadStateChange = this.handleReadStateChange.bind(this)
    this.handleBookTypeChange = this.handleBookTypeChange.bind(this)
    this.handleGroupByName = this.handleGroupByName.bind(this)
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

  render () {
    let {readState, bookType, groupByName} = this.props.settings
    return (
    <div>
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
             <MenuItem value={'comic'} primaryText='Comic' />
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

Bar.propTypes = {
  onAppChange: React.PropTypes.func.isRequired,
  settings: React.PropTypes.object.isRequired
}
