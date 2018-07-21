import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';

export default class TagsDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    }
    this.style = {
      tag: {
        display: 'inline-block',
        overflow: 'visible',
        fontSize: '16px',
        zIndex: '10000000'
      },
      tagWrapper: {
        position: 'absolute',
        width: '100%',
        position: 'sticky',
        top: '80px',
        zIndex: '100',
        backgroundColor: 'white',
        whiteSpace: 'nowrap'
      }
    }
  }

  componentDidMount() {
    const self = this;
    Meteor.call('tags.display', (error, result) => {
      self.setState({
        tags: result,
      })
    });
  }

  listTags() {
    return this.state.tags.map((item, index) => {
      return (
          <a key = {index} className = "chip bp-green" style = {this.style.tag} href="">{item.tag_name}</a>
      )
    })
  }

  render() {
    return (
      <div className = 'tagWrapper' style = {this.style.tagWrapper}>
        <h6>Can't decide? Here's some extra help:</h6>
        {this.listTags()}
      </div>
    )
  }
}
