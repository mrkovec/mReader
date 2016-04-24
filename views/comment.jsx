import React from 'react';

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    //this.tick = this.tick.bind(this);
  }
  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    )
  }
}
