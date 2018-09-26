import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';

export default class TagsUtil extends Component {
  constructor(props) {
    super(props);
    this.handleRun = this.handleRun.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this)
    this.handleRestart = this.handleRestart.bind(this)
    this.state = {
      stage: 'check tags',
      loading: false,
      errorMessages: [],
      resultMessages: [],
      tags: [],
      transferStatus: 0,
    }
  }

  handleRun = () => {
    const self = this
    self.setState({
      loading: true
    })
    Meteor.call('check_tags', (error, result) => {
      if (result) {
        self.setState({
          loading: false,
          stage: 'show tags',
          tags: result,
        })
      } else {
        self.setState({
          loading: false,
          errorMessages: error
        })
      }
    });
  }

  handleTransfer = () => {
    const self = this
    self.setState({
      loading: true
    })
    var request = 0;
    for (var i = 0; i < this.state.tags.length; i++) {
      Meteor.call('tags.insert', this.state.tags[i], (error, result) => {
        if (result) {
          this.setState(prevState => ({
            resultMessages: [...prevState.resultMessages, result]
          }))
          request ++
          this.setState({transferStatus: request})
        }
        if (error) {
          this.setState(prevState => ({
            errorMessages: [...prevState.errorMessages, error]
          }))
          request ++
          this.setState({transferStatus: request})
        }
      })
      if (request == i) {
        self.setState({
          loading: false,
          stage: 'transfer success'
        })
      }
    };
  }

  mapTags = () => {
    return this.state.tags.map((item, index) => {
      return (
        <p key={index}>{item}</p>
      )
    })
  }

  resultMsg = () => {
    return this.state.resultMessages.map((item, index) => {
      return (
        <p key = {index}>{item}</p>
      )
    })
  }

  errorMsg = () => {
    return this.state.errorMessages.map((item, index) => {
      return (
        <p key = {index} className = "white-text">{item}</p>
      )
    })
  }

  handleRestart() {
    this.setState({
      collection: '',
      stage: 'check tags',
      loading: false,
      errorMessages: [],
      resultMessages: [],
      tags: [],
      transferStatus: 0,
    })
  }

  renderStep() {
    switch (this.state.stage) {
      case 'check tags':
      return (
        <div>
          <h6>let us check out what are the available tags</h6>
          <a
            className = "add-margin-top btn"
            onClick = {this.handleRun}
            disabled={(this.state.loading) ? true : false}
          >
            {(this.state.loading)?"loading":"run"}
          </a>
        </div>
      );
      break;
      case 'show tags':
      return (
        <div>
          <h6>Here are the tags we have:</h6>
          {this.mapTags()}
          <h6>Shall we transfer these tags to the collection?</h6>
          <a
            className = "add-margin-top btn"
            onClick = {this.handleTransfer}
          >
            {(this.state.loading)?"loading":"transfer"}
          </a>
        </div>
      );
      break;
      case 'transfer success':
      return (
        <div>
          <h6>Here are the transfer results:</h6>
          {this.resultMsg()}
          <div className = "row">
            <div className = "col l6 m6 s6">
              <a className = "add-margin-top btn" href="/">close</a>
            </div>
            <div className = "col l6 m6 s6">
              <a className = "add-margin-top btn" onClick={this.handleRestart}>restart</a>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className = "container center">
        <div className = "card">
          <div className = "card-content">
            <div className = "card bp-red">
              {this.errorMsg()}
            </div>
            {
              this.state.tags.length?
                <p>Status: {this.state.transferStatus?this.state.transferStatus:'0'} / {this.state.tags.length}</p>
              :
                null
            }
            {this.renderStep()}
          </div>
        </div>
      </div>
    )
  }
}
