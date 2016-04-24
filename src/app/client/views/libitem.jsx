import React from 'react'
import IpcRenderer from 'ipc-renderer'

import ListItem from 'material-ui/lib/lists/list-item'
import LinearProgress from 'material-ui/lib/linear-progress'

import {grey100, darkBlack, lightBlack} from 'material-ui/lib/styles/colors'
import Paper from 'material-ui/lib/paper'

export default class LibItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {opened: false}
    this.onBookOpen = this.onBookOpen.bind(this)
    this.compItem = this.compItem.bind(this)
    this.onNestedToggle = this.onNestedToggle.bind(this)
  }

  onBookOpen (i) {
    // console.log(e)
    IpcRenderer.send('book', {type: 'open', msg: this.props.book.nested ? this.props.book.nested[i] : this.props.book})
  }

  onNestedToggle (a) {
    // console.log(a.state.open)
    this.setState({opened: !a.state.open})
  }

  compItem (book, i) {
    let {name, issue, nested, img} = book
    if (nested) {
      let sub = nested.map((item, i) => {
        return (this.compItem(item, i))
      })
      // console.log(name)
      // innerDivStyle={this.state.opened ? {'backgroundColor': grey400} : null}
      return (
        <div className='itemContainer' >
          <Paper rounded={false} zDepth={1} style={this.state.opened ? {'backgroundColor': grey100} : null}>
          <ListItem nestedItems={sub} primaryText={<p>{name} <span style={{color: lightBlack}}>{nested.length}</span></p>}
          primaryTogglesNestedList={true} onNestedListToggle={this.onNestedToggle}
          />
          </Paper>
        </div>
      )
    }
    return (
      // <div key={i ? i : null} className='itemContainer' style={{'background-image': `url('${encodeURI(img[0])}')`, 'background-size': 'cover', 'background-position': 'center center'}}>
      <div key={i ? i : null} className='itemContainer' >
      <ListItem  primaryText={
            <p><span style={{color: lightBlack}}>{issue}</span> <b>{name}</b></p>
          }
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>{img ? img.length : null}</span>
              tralala
            </p>
          }
          secondaryTextLines={2}
          onClick= {() => {this.onBookOpen(i)}}
      />
      <LinearProgress mode='determinate' min={1} max ={1} value={1} />
      </div>
    )
  }

  render () {
    // console.log(this.props.book)
  //  console.log(this.compItem(this.props.book))
    return this.compItem(this.props.book)
  //   let {name, issue, nested, img} = this.props.book
  //   let sub = []
  //   console.log(nested)
  //   if (nested) {
  //     sub = nested.map((item, i) => {
  //       return (
  //         <ListItem key={i} primaryText={`${item.issue} - ${item.name}`} />
  //       )
  //     })
  //   }
  //   //name = nested ? `${name}` : `<span style={{color: lightBlack}}>${issue}</span> ${name}`
  //   //rightAvatar ={<img src={img[0]} width={'60px'} />}
  //   return (
  //     <ListItem nestedItems={sub} primaryText={
  //           <p><span style={{color: lightBlack}}>{issue}</span> {name}</p>
  //         }
  //         secondaryText={
  //           <p>
  //             <span style={{color: darkBlack}}>{img.length}</span>
  //             tralala
  //           </p>
  //         }
  //         secondaryTextLines={2}
  //         onTouchTap={nested ? null : this.onBookOpen}
  //     />
  //   )
  }
}
