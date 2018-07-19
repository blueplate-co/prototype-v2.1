import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';

export default class TagsUtil extends Component {
  constructor(props) {
    super(props);
    this.handleRun = this.handleRun.bind(this);
    this.state = {
      stage: 'check tags',
      loading: false,
      tags: []
    }
  }

  handleRun = () => {
    const self = this
    self.setState({
      stage: 'show tags',
      loading: true
    })
    Meteor.call('check_tags', (error, result) => {
      if (result) {
        self.setState({
          loading: false,
          tags: result,
        })
      }
    });
  }

  mapTags = () => {
    return this.state.tags.map((item, index) => {
      return (
        <p key={index}>{item}</p>
      )
    })
  }

  renderStep() {
    switch (this.state.stage) {
      case 'check tags':
      return (
        <h6>let us check out what are the available tags</h6>
        <a className = "add-margin-top btn" onClick = {this.handleRun}>run</a>
      );
      break;
      case 'show tags':
      return (
        <h6>here are the tags we have</h6>
        {this.mapTags()}
      );
      break;
    }
  }

  render() {
    return (
      <div className = "container">
        {this.renderStep()}
      </div>
    )
  }
}
