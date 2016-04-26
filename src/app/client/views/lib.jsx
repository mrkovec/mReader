import React from 'react'
import LibItem from './libitem'

export default class Lib extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    // return null
    let {library} = this.props
    let lib = 'no books found'
    if (library.length > 0) {
      lib = library.map((book, i) => {
        return (
          <div key={i} className='itemContainer'>
            <LibItem book={book} />
          </div>
        )
      })
    }
    return (
      <div className='libContainer'>
        {lib}
      </div>
    )
  }
}

Lib.propTypes = {
  library: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object.isRequired
}
