import React from 'react'
import IpcRenderer from 'ipc-renderer'
import Remote from 'remote'
import {Tabs, Tab} from 'material-ui/Tabs'
import ActionHome from 'material-ui/svg-icons/action/home'
import Package from './../../../../package.json'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
// import Set from './../../settings.json'

export default class About extends React.Component {
  constructor (props) {
    super(props)
    this.onBack = this.onBack.bind(this)
  }
  onBack () {
    this.props.onAppChange({view: 'library'})
  }
  render () {
    return (
      <Paper>
      <Tabs initialSelectedIndex={1}>
        <Tab icon={<ActionHome/>} onActive={this.onBack}/>
        <Tab label='About'>
          <h1>{Package.name} {Package.version}</h1>
          <p>electron {process.versions['electron']}</p>
          <p>chrome {process.versions['chrome']}</p>
          <p>node.js {process.versions['node']}</p>
          <p>react.js {Package.dependencies.react}</p>
          <p>material-ui {Package.dependencies['material-ui']}</p>
          <p>pdf.js {Package.dependencies['pdfjs-dist']}</p>
          <p>xml2js {Package.dependencies.xml2js}</p>
        </Tab>
        <Tab label='Settings'>
          <Settings/>
        </Tab>
      </Tabs>
      </Paper>
    )
  }
}
About.propTypes = {
  // onAppChange: React.PropTypes.func.isRequired,
  // book: React.PropTypes.instanceOf(Book)
}

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = Remote.getGlobal('AppSettings')
    this.handlePath7zChange = this.handlePath7zChange.bind(this)
    this.handleZoomChange = this.handleZoomChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  handlePath7zChange (e) {
    this.setState({path7z: e.target.value})
  }
  handleZoomChange (e) {
    let p = e.target.value
    if (e.target.value) {
      p = Number(e.target.value)
      if (isNaN(p)) {
        p = 0
      }
    }
    this.setState({zoomlevel: p})
  }
  handleSave () {
    if (!this.state.path7z) {
      this.state.path7z = './bin/'
      this.setState({path7z: './bin/'})
    }
    if (!this.state.zoomlevel) {
      this.state.zoomlevel = 0
      this.setState({zoomlevel: 0})
    }
    IpcRenderer.send('settings', this.state)
  }
  render () {
    return (
      <section>
        <div><TextField floatingLabelText={'path to 7z'} floatingLabelFixed={true} value={this.state.path7z} onChange={this.handlePath7zChange} /></div>
        <div><TextField floatingLabelText={'zoom level'} floatingLabelFixed={true} value={this.state.zoomlevel} onChange={this.handleZoomChange} /></div>
        <RaisedButton label='Save' primary={true} fullWidth={true} onTouchTap={this.handleSave}/>
        <p>In order for the changes to take effect, please restart the application.</p>
      </section>
    )
  }
}
